import streamlit as st
import streamlit.components.v1 as components

# Page Config
st.set_page_config(
    page_title="AI Government Scheme Assistant",
    page_icon="🇮🇳",
    layout="wide"
)

# Read CSS
with open("style.css", "r") as f:
    css = f.read()

# Read HTML
with open("index.html", "r") as f:
    html = f.read()

# Inject CSS into HTML
final_html = f"""
<style>
{css}
</style>

{html}
"""

# Display UI
components.html(
    final_html,
    height=1000,
    scrolling=True
)