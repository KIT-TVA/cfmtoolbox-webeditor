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
    Endpoint for converting the specified format to the CFM toolbox JSON format.
    """
    match file_type:
        case "UVL" | "uvl":
            return await uvl_file_to_json(featuremodel)
        case _:
            return Response(
                content="Unsupported file type",
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )


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
