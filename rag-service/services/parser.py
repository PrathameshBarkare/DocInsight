from docling.document_converter import DocumentConverter
from pathlib import Path

convertor = DocumentConverter()

def parse_pdf(file_path):
  full_path = Path("../backend") / file_path

  print("Received path:", file_path)
  print("Resolved path:", full_path)
  print("Exists:", full_path.exists())

  result = convertor.convert(full_path)
  return result.document.export_to_markdown()
