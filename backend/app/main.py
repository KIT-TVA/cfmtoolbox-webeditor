from fastapi import FastAPI
import subprocess

app = FastAPI()


@app.post("/convert/tojson")
async def convert_to_json():
    # TODO: All of the below
    # Write input to file example.uvl
    a = subprocess.run(
        ["cfmtoolbox", "--import", "example.uvl", "--export", "example.json"],
        capture_output=True,
        text=True,
    )
    # read example.json and send it back as a result
    return {"result": a}


@app.post("/convert/touvl")
async def convert_to_uvl(): ...
