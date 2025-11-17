from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()  
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# Correct API key usage
client = genai.Client(api_key=GOOGLE_API_KEY)

mcp = FastMCP()

@mcp.tool()
async def get_encoding_plan(columns: Any) -> str:

    prompt = (
        "You are a data preprocessing expert.\n\n"
        "You will receive a list of columns from a CSV file.\n"
        "Each column contains:\n"
        "- name\n"
        "- dtype (string, int, float, etc.)\n"
        "- sample values (5 example values)\n"
        "- number of unique values (optional)\n\n"
        "Your job:\n"
        "For EACH column, determine the most appropriate encoding type.\n\n"
        "Encoding rules:\n"
        "1. Numerical columns (int, float):\n"
        '   - encoding: "none"\n\n'
        "2. Categorical columns:\n"
        "   If unique values ≤ 10 → \"one_hot\"\n"
        "   If 10 < unique ≤ 50 → \"label\"\n"
        "   If 50 < unique ≤ 500 → \"frequency\"\n"
        "   If unique > 500 → \"target\"\n\n"
        "3. Text columns (large strings):\n"
        '   - encoding: "text_vectorization"\n\n'
        "4. Date/Time columns:\n"
        '   - encoding: "datetime_features"\n\n'
        "Return ONLY JSON in this format:\n"
        "{\n"
        '  "encoding_plan": [\n'
        "    {\n"
        '      "column": "column_name",\n'
        '      "dtype": "string/int/etc",\n'
        '      "recommended_encoding": "one_hot/label/frequency/etc",\n'
        '      "reason": "why this encoding is selected"\n'
        "    }\n"
        "  ]\n"
        "}\n"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt + "\n\nColumns:\n" + str(columns),
        config={"response_mime_type": "application/json"}
    )

    return response.text

import pandas as pd
from sklearn.preprocessing import LabelEncoder


def apply_one_hot(col):
    return pd.get_dummies(col, prefix=col.name)

def apply_label(col):
    le = LabelEncoder()
    return pd.Series(le.fit_transform(col), name=col.name)

def apply_frequency(col):
    freq = col.value_counts()
    return col.map(freq)

def apply_datetime(col):
    dt = pd.to_datetime(col, errors='coerce')
    return pd.DataFrame({
        f"{col.name}_year": dt.dt.year,
        f"{col.name}_month": dt.dt.month,
        f"{col.name}_day": dt.dt.day
    })

@mcp.tool()
async def do_encoding(plan: dict, data: list):
    """
    plan → { "encoding_plan": [ {...}, {...} ] }
    data → actual dataset rows (from frontend)
    """

    # Convert data list → DataFrame
    df = pd.DataFrame(data)

    if "encoding_plan" not in plan:
        return {"error": "Invalid encoding plan format"}

    encoding_list = plan["encoding_plan"]
    final_df = pd.DataFrame()

    for item in encoding_list:
        col = item["column"]
        method = item["recommended_encoding"]

        if method == "one_hot":
            encoded = apply_one_hot(df[col])
            final_df = pd.concat([final_df, encoded], axis=1)

        elif method == "label":
            encoded = apply_label(df[col])
            final_df[col] = encoded

        elif method == "frequency":
            encoded = apply_frequency(df[col])
            final_df[col] = encoded

        elif method == "datetime_features":
            encoded = apply_datetime(df[col])
            final_df = pd.concat([final_df, encoded], axis=1)

        elif method == "none":
            final_df[col] = df[col]

        else:
            final_df[col] = df[col]

    return final_df.to_dict(orient="records")
