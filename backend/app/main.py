from typing import List

from fastapi import BackgroundTasks, FastAPI, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings

from .converters import json_to_uvl_file, uvl_file_to_json
from .types import CFMJson


class Settings(BaseSettings):
    """
    Application settings.
    """
    app_name: str = "CFM-Toolbox Webeditor Backend"
    allowed_origins: List[str] = ["http://localhost:3000"]

__version__: str = "1.0.0"
settings = Settings()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/convert/tojson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_to_json(file_type: str, featuremodel: UploadFile):
    """
    Endpoint for converting from UVL to JSON format.
    """
    match file_type:
        case "UVL" | "uvl":
            return await uvl_file_to_json(featuremodel)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )


async def receive_uvl_file(featuremodel: UploadFile) -> dict:
    """
    Create a CFMJson from the provided UVL object.
    """
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
async def convert_from_json(
    file_type: str, featuremodel: CFMJson, background_tasks: BackgroundTasks
):
    """
    Endpoint for converting from the CFM toolbox JSON to the specified format.
    """
    match file_type:
        case "UVL" | "uvl":
            return await json_to_uvl_file(featuremodel, background_tasks)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
