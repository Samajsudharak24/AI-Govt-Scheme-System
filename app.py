import streamlit as st
from google import genai
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
from dotenv import load_dotenv
# -------------------------
# PAGE CONFIG
# -------------------------

st.set_page_config(
    page_title="AI Government Scheme Assistant",
    page_icon="🇮🇳"
)
# -------------------------
# SIDEBAR
# -------------------------

with st.sidebar:

    st.title("ℹ️ About")

    st.write("""
This AI-powered system recommends suitable government schemes based on:

✅ Age  
✅ State  
✅ Occupation  
✅ Family Income  

Built using:

• Gemini AI  
• FAISS Search  
• RAG Architecture  
• Government PDF Knowledge Base
""")

    st.info("🇮🇳 Helping citizens discover the right schemes")
# -------------------------
# CUSTOM STYLE
# -------------------------

st.markdown("""
<style>
.stApp {
    background-color: #EAF6FF;
}
h1 {
    color: #003366;
}
</style>
""", unsafe_allow_html=True)

# -------------------------
# GEMINI API
# -------------------------
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=api_key
)

# -------------------------
# LOAD MODEL + FAISS
# -------------------------

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index("scheme_index.faiss")

pdf_folder = "scheme_data"
documents = []
# -------------------------
# SCHEME APPLY LINKS
# -------------------------

scheme_links = {
    "National Scholarship Portal": "https://scholarships.gov.in/",
    "PM-Kisan": "https://pmkisan.gov.in/",
    "Mudra Loan": "https://www.mudra.org.in/",
    "Ayushman Bharat": "https://beneficiary.nha.gov.in/"
}

# Read all PDFs
for file in os.listdir(pdf_folder):

    if file.endswith(".pdf"):

        file_path = os.path.join(pdf_folder, file)

        reader = PdfReader(file_path)

        for page in reader.pages:
            text = page.extract_text()

            if text:
                documents.append(text)

# -------------------------
# TITLE
# -------------------------
st.markdown("""
<div style="
background: linear-gradient(135deg, #2563EB, #60A5FA);
padding: 30px;
border-radius: 20px;
text-align: center;
color: white;
margin-bottom: 25px;
box-shadow: 0px 4px 15px rgba(0,0,0,0.15);
">

<h1>
🇮🇳 AI Government Scheme Assistant
</h1>

<p style="font-size:18px;">
Helping citizens discover the right government schemes using AI + RAG
</p>

</div>
""", unsafe_allow_html=True)
st.markdown("<br>", unsafe_allow_html=True)

st.markdown("## 📝 Enter Your Details")
states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam",
    "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi"
]

with st.container():

    age = st.number_input(
        "Enter your age",
        min_value=1,
        max_value=100
    )

    state = st.selectbox(
        "Select your state",
        states
    )

    occupation = st.selectbox(
        "Select occupation",
        [
            "Student",
            "Farmer",
            "Job Seeker",
            "Private Employee",
            "Government Employee",
            "Business Owner",
            "Self Employed",
            "Senior Citizen",
            "Woman Entrepreneur",
            "Disabled Person",
            "Other"
        ]
    )

    income = st.number_input(
        "Enter yearly family income (₹)",
        min_value=0,
        step=1000
    )


# -------------------------
# BUTTON
# -------------------------

if st.button("🔍 Find Schemes", use_container_width=True):

    user_query = f"""
    Age: {age}
    State: {state}
    Occupation: {occupation}
    Family Income: ₹{income}

    Suggest suitable government schemes.
    """

    # Convert query into embedding
    query_embedding = model.encode([user_query])

    # Search in FAISS
    k = 2

    distances, indices = index.search(
        np.array(query_embedding),
        k
    )

    relevant_text = ""

    for idx in indices[0]:
        relevant_text += documents[idx] + "\n"

    # Gemini Prompt
    prompt = f"""
    You are an AI Government Scheme Assistant.

    Use ONLY the information below.

    Relevant Information:
    {relevant_text}

    User Profile:
    {user_query}

    Give:
    1. Best matching schemes
    2. Benefits
    3. Required documents
    4. How to apply

    Keep answer simple and easy to understand.
    """

    with st.spinner("🔎 Finding best government schemes for you..."):

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

    st.success("✅ Schemes Found Successfully!")

    st.subheader("🎯 Recommended Government Schemes")

    st.info(response.text)
    st.subheader("🔗 Apply Here")

    for scheme, link in scheme_links.items():

        if scheme.lower() in response.text.lower():

            st.markdown(
                f"✅ [{scheme}]({link})"
            )