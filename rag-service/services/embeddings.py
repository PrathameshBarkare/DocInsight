from sentence_transformers import SentenceTransformer

model = None

def generate_embeddings(data):
    global model

    if model is None:
        model = SentenceTransformer("BAAI/bge-small-en-v1.5")

    embeddings = model.encode(data)

    return embeddings.tolist()