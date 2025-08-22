import json
import os
import random
import string
import subprocess

import aiofiles
from fastapi import BackgroundTasks, FastAPI, Response, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .types import CFMJson
from .utils import EnhancedJSONEncoder

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://193.196.37.174",
    ],
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/convert/tojson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_to_json(file_type: str, featuremodel: UploadFile):
    """
    Endpoint for converting the specified format to the CFM toolbox JSON format.
    """
    match file_type:
        case "UVL" | "uvl":
            return await receive_uvl_file(featuremodel)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )


async def receive_uvl_file(featuremodel: UploadFile) -> dict:
    filename = generate_random_filename(8, "uvl")
    result_filename = filename.replace(".uvl", ".json")
    async with aiofiles.open(filename, "wb") as out_file:
        while content := await featuremodel.read(1024):  # Read in 1024b chunks
            await out_file.write(content)
    try:
        call_cfm_toolbox_conversion(filename, result_filename)
    except RuntimeError as e:
        return Response(
            content=f"Error during conversion: {str(e)}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    async with aiofiles.open(result_filename, "rb") as result_file:
        content = await result_file.read()
    featuremodel_json = json.loads(content)

    # Cleanup temp files
    os.remove(filename)
    os.remove(result_filename)
    return featuremodel_json


@app.post("/convert/fromjson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_from_json(file_type: str, featuremodel: CFMJson, background_tasks: BackgroundTasks):
    """
    Endpoint for converting from the CFM toolbox JSON to the specified format.
    """
    match file_type:
        case "UVL" | "uvl":
            return await create_uvl_file(featuremodel, background_tasks)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )


async def create_uvl_file(featuremodel: CFMJson, background_tasks: BackgroundTasks) -> Response:
    """
    Create a UVL file from the provided CFMJson object.
    """
    filename = generate_random_filename(8, "json")
    result_filename = filename.replace(".json", ".uvl")
    async with aiofiles.open(filename, "w") as out_file:
        await out_file.write(json.dumps(featuremodel, cls=EnhancedJSONEncoder))
    try:
        call_cfm_toolbox_conversion(filename, result_filename)
    except RuntimeError as e:
        return Response(
            content=f"Error during conversion: {str(e)}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # Cleanup temp files
    background_tasks.add_task(
        lambda files: [os.remove(f) for f in files], [filename, result_filename]
    )

    return FileResponse(path=result_filename, filename=result_filename, status_code=214)


def generate_random_filename(length: int, extension: str = None) -> str:
    random_string = "".join(
        random.choice(string.ascii_letters + string.digits) for _ in range(length)
    )
    if extension:
        return f"{random_string}.{extension}"
    else:
        return random_string


def call_cfm_toolbox_conversion(input_file: str, output_file: str) -> None:
    """
    Call the cfmtoolbox command line tool to convert files.
    """
    try:
        subprocess.run(
            ["cfmtoolbox", "--import", input_file, "--export", output_file, "convert"],
            check=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error during conversion: {e.stderr.decode()}") from e
