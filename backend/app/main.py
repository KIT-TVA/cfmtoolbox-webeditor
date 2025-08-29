from fastapi import BackgroundTasks, FastAPI, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from .types import CFMJson
from .converters import receive_uvl_file, create_uvl_file

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://193.196.37.174",  # BWC instance.
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

@app.post("/convert/fromjson/{file_type}/", status_code=214)  # 214 - Transformation applied
async def convert_from_json(
    file_type: str, featuremodel: CFMJson, background_tasks: BackgroundTasks
):
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
