from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services.parser import parse_pdf

app = FastAPI()

class ParseRequest(BaseModel):
    file_path: str

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
