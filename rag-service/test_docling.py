from docling.document_converter import DocumentConverter

converter = DocumentConverter()

result = converter.convert("../backend/uploads/1780679965682-astronomy.pdf")

print(result.document.export_to_markdown())