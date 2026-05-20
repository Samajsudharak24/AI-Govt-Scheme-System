import streamlit as st
from google import genai
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
from dotenv import load_dotenv
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(
            f"<style>{f.read()}</style>",
            unsafe_allow_html=True
        )
# -------------------------
# PAGE CONFIG
# -------------------------

st.set_page_config(
    page_title="AI Government Scheme Assistant",
    page_icon="🇮🇳",
    layout="wide"
)
load_css("style.css")
st.markdown("""
<div style="
background: linear-gradient(135deg, #1E3A8A, #2563EB);
padding: 30px;
border-radius: 20px;
display:flex;
justify-content:space-between;
align-items:center;
color:white;
margin-bottom:30px;
">

<div>
<h1 style="margin:0;">
🇮🇳 AI Government Scheme Assistant
</h1>

<p style="font-size:18px; margin-top:10px;">
Helping citizens discover the right government schemes using AI + RAG
</p>
</div>

<div style="
background: rgba(255,255,255,0.15);
padding:12px 20px;
border-radius:30px;
font-size:16px;
">
🔒 Secure & Private
</div>

</div>
""", unsafe_allow_html=True)

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
# -------------------------
# PREMIUM FORM SECTION
# -------------------------
# -------------------------
# PREMIUM FORM SECTION
# -------------------------

st.markdown("<br>", unsafe_allow_html=True)

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

occupations = [
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

main_col, side_col = st.columns([2, 1])

with main_col:

    st.markdown("""
    <div style="
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0px 4px 20px rgba(0,0,0,0.08);
    margin-bottom:20px;
    ">
    <h2 style="color:#1e3a8a;">
    📝 Check Eligibility
    </h2>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:

        age = st.number_input(
            "Enter your age",
            min_value=1,
            max_value=100
        )

        state = st.selectbox(
            "Select your state",
            states
        )

    with col2:

        occupation = st.selectbox(
            "Select occupation",
            occupations
        )

        income = st.number_input(
            "Enter yearly family income (₹)",
            min_value=0,
            step=1000
        )

    st.markdown("</div>", unsafe_allow_html=True)

with side_col:

    st.markdown("""
    <div style="
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0px 4px 20px rgba(0,0,0,0.08);
    ">
    <h2 style="color:#1e3a8a;">
    ⚙️ Technology Stack
    </h2>

    ✅ Gemini AI <br><br>
    ✅ FAISS Search <br><br>
    ✅ RAG Architecture <br><br>
    ✅ PDF Knowledge Base <br><br>

    <p style="color:gray;">
    Helping citizens find eligible schemes using AI.
    </p>

    </div>
    """, unsafe_allow_html=True)

# -------------------------
# BUTTON
# -------------------------

st.markdown("<br>", unsafe_allow_html=True)

if st.button(
    "🔍 Find Schemes",
    use_container_width=True,
    type="primary"
):
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
    k = 5

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

    First prioritize the information from the provided PDF knowledge base.

    If enough information is available in PDFs, use that.

    If relevant information is missing, intelligently recommend additional suitable government schemes based on the user's profile, state, occupation, age, and income.

    Relevant Information:
    {relevant_text}

    User Profile:
    {user_query}

    Give:

    1. Best matching government schemes
    2. Benefits of each scheme
    3. Required documents
    4. How to apply
    5. Mention whether recommendation came from PDF knowledge base or AI recommendation

    Keep answer simple and easy to understand.
    """
    

    with st.spinner("🔎 Finding best government schemes for you..."):

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )

    st.success("✅ Schemes Found Successfully!")

    st.markdown("""
    <div style="
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0px 4px 20px rgba(0,0,0,0.08);
    margin-top:20px;
    margin-bottom:20px;
    ">
    <h2 style="color:#1e3a8a;">
    🎯 Recommended Government Schemes
    </h2>
    """, unsafe_allow_html=True)

    st.write(response.text)

    st.markdown("</div>", unsafe_allow_html=True)

    st.subheader("🔗 Apply Here")

    for scheme, link in scheme_links.items():

        if scheme.lower() in response.text.lower():

            st.markdown(
                f"✅ [{scheme}]({link})"
            )
    st.markdown("---")

    st.markdown("""
    <div style="
    text-align:center;
    color:gray;
    padding:10px;
    ">
    Built using ❤️ AI + RAG for smarter welfare discovery
    </div>
    """, unsafe_allow_html=True)       