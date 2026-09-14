import os, sys
from sqlalchemy import create_engine
import pandas as pd

url = "postgresql+psycopg://neondb_owner:npg_byOpDx6i0MjE@ep-green-poetry-aysna7v3-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(url)
with engine.connect() as conn:
    df = pd.read_sql('SELECT * FROM issue_clusters LIMIT 1', conn)
    print(df.to_json(orient='records'))
