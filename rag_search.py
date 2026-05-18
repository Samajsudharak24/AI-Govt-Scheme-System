from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from google import genai
import faiss
import numpy as np
import os

# Gemini API
client = genai.Client(
    api_key="AIzaSyASNN5u2vXOjUHVrqG_GAi81bNGjgR2NZo"
)

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAISS index
index = faiss.read_index("scheme_index.faiss")

pdf_folder = "scheme_data"

documents = []

# Read all PDFs
for file in os.listdir(pdf_folder):

    if file.endswith(".pdf"):

        file_path = os.path.join(pdf_folder, file)

        reader = PdfReader(file_path)

        for page in reader.pages:
            text = page.extract_text()

            if text:
                documents.append(text)

# Ask user question
query = input("Ask your question: ")

# Convert question into embedding
query_embedding = model.encode([query])

# Search in FAISS
k = 2

distances, indices = index.search(
    np.array(query_embedding),
    k
)

# Get relevant text
relevant_text = ""

for idx in indices[0]:
    relevant_text += documents[idx] + "\n"

# Prompt for Gemini
prompt = f"""
You are a helpful government scheme assistant.

Use ONLY the information below to answer.

Relevant Information:
{relevant_text}

User Question:
{query}

Give a simple and clear answer.
Mention possible scheme name if found.
"""

# Gemini response
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

print("\nAI Answer:\n")
print(response.text)