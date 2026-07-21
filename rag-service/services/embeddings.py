from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def generate_embeddings(data):
    embeddings = model.encode(data)

    return embeddings.tolist()