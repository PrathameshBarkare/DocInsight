from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import tempfile
import os

app = FastAPI()

class EmbeddingRequest(BaseModel):
    texts: list[str]

@app.post("/parse")
async def parse_document(file: UploadFile = File(...)):
    from services.parser import parse_pdf
    temp_file_path = None

    try:
        print("Request received:", file.filename)

        file_extension = os.path.splitext(file.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        ) as temp_file:

            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        markdown = parse_pdf(temp_file_path)

        return {
            "success": True,
            "markdown": markdown
        }

    except Exception as e:
        print("Docling Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/embeddings")
def generate_embeddings_api(request: EmbeddingRequest):
    from services.embeddings import generate_embeddings
    try:
        embeddings = generate_embeddings(request.texts)

        return {
            "success": True,
            "embeddings": embeddings
        }

    except Exception as e:
        print("Embedding Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )