from pypdf import PdfReader
import os

# Folder where PDFs are stored
pdf_folder = "scheme_data"

all_text = ""

# Read all files inside folder
for file in os.listdir(pdf_folder):

    # Only read PDFs
    if file.endswith(".pdf"):

        file_path = os.path.join(pdf_folder, file)

        print(f"Reading: {file}")

        # Open PDF
        reader = PdfReader(file_path)

        # Read every page
        for page in reader.pages:
            text = page.extract_text()

            if text:
                all_text += text + "\n"

# Print first 1000 characters
print("\nPDF Text Preview:\n")
print(all_text[:1000])