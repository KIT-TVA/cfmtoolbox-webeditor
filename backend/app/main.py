import json
import os
import random
import string
import subprocess

import aiofiles
from fastapi import FastAPI, Response, UploadFile, status

app = FastAPI()


@app.post("/convert/tojson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_to_json(file_type: str, featuremodel: UploadFile):
    match file_type:
        case "UVL" | "uvl":
            return await handle_uvl_file(featuremodel)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )


async def handle_uvl_file(featuremodel: UploadFile) -> dict:
    filename = generate_random_filename(8, "uvl")
    result_filename = filename.replace(".uvl", ".json")
    async with aiofiles.open(filename, "wb") as out_file:
        while content := await featuremodel.read(1024):  # Read in 1024b chunks
            await out_file.write(content)
    subprocess.run(
        ["cfmtoolbox", "--import", filename, "--export", result_filename, "convert"], check=True
    )
    async with aiofiles.open(result_filename, "rb") as result_file:
        content = await result_file.read()
    featuremodel_json = json.loads(content)

    # Cleanup temp files
    os.remove(filename)
    os.remove(result_filename)
    return featuremodel_json


@app.post("/convert/fromjson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_to_uvl(file_type: str, featuremodel: str): ...


# TODO: Implement json to UVL conversion


def generate_random_filename(length: int, extension: str = None) -> str:
    random_string = "".join(
        random.choice(string.ascii_letters + string.digits) for _ in range(length)
    )
    if extension:
        return f"{random_string}.{extension}"
    else:
        return random_string
