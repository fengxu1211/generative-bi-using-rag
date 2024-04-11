import streamlit as st

try:
    import streamlit_debug

    streamlit_debug.set(flag=True, wait_for_client=True, host='0.0.0.0', port=8765)

except Exception as e:
    print(f"non debug mode")

st.set_page_config(
    page_title="Intelligent BI",
    page_icon="👋",
)

st.write("## Welcome to Intelligent BI Playground! Aoyu👋")

st.sidebar.success("Select a demo above.")

st.markdown(
    """
    Welcome to the Natural Language Querying Playground! This interactive application is designed to bridge the gap between natural language and databases. Enter your query in plain English, and watch as it's transformed into a SQL or Pandas command. The result can then be visualized, giving you insights without needing to write any code. Experiment, learn, and see the power of NLQ in action!
"""
)