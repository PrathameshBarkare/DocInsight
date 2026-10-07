from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import tempfile
import os

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/test-upload")
async def test_upload(file: UploadFile = File(...)):
    print("TEST UPLOAD RECEIVED:", file.filename)

    contents = await file.read()

    print("FILE SIZE:", len(contents))

    return {
        "filename": file.filename,
        "size": len(contents)
    }

@app.get("/test-docling")
def test_docling():
    print("STEP 1: Starting Docling import")

    from services.parser import parse_pdf

    print("STEP 2: Docling imported successfully")

    return {
        "message": "Docling initialized successfully"
    }

class EmbeddingRequest(BaseModel):
    texts: list[str]

@app.post("/parse")
async def parse_document(file: UploadFile = File(...)):
    print("STEP 1: Request received:", file.filename)

    try:
        print("STEP 2: Importing parser...")
        from services.parser import parse_pdf
        print("STEP 3: Parser imported")

        temp_file_path = None

        file_extension = os.path.splitext(file.filename)[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        ) as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        print("STEP 4: Temporary file created:", temp_file_path)

        markdown = parse_pdf(temp_file_path)

        print("STEP 5: PDF parsed successfully")

        return {
            "success": True,
            "markdown": markdown
        }

    except Exception as e:
        print("Docling Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

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