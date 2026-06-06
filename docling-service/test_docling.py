from docling.document_converter import DocumentConverter

converter = DocumentConverter()

result = converter.convert("lec9Notes.pdf")

markdown = result.document.export_to_markdown()

print(markdown[:2000])  # print first 2000 chars