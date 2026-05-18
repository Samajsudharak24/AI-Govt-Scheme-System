from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

pdf_folder = "scheme_data"

documents = []

# Read all PDFs
for file in os.listdir(pdf_folder):

    if file.endswith(".pdf"):

        file_path = os.path.join(pdf_folder, file)

        print(f"Reading: {file}")

        reader = PdfReader(file_path)

        for page in reader.pages:
            text = page.extract_text()

            if text:
                documents.append(text)

# Convert text into embeddings
print("Creating embeddings...")

embeddings = model.encode(documents)

# Create FAISS index
dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(np.array(embeddings))

# Save index
faiss.write_index(index, "scheme_index.faiss")

print("FAISS index created successfully!")