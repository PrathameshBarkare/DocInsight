from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services.parser import parse_pdf
from services.embeddings import generate_embeddings

app = FastAPI()

class ParseRequest(BaseModel):
    file_path: str
    
class EmbeddingRequest(BaseModel):
    texts: list[str]

@app.post("/parse")
def parse_document(request: ParseRequest):
    try:
        print("Request received:", request.file_path)
        markdown = parse_pdf(request.file_path)

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

@app.post("/embeddings")
def generate_embeddings_api(request: EmbeddingRequest):
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
