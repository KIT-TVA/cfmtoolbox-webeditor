import json
import os

import aiofiles
from fastapi import BackgroundTasks, Response, UploadFile, status
from fastapi.responses import FileResponse

from ..types import CFMJson
from ..utils import EnhancedJSONEncoder, generate_random_filename
from .convert import call_cfm_toolbox_conversion


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