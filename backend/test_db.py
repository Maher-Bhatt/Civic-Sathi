import os, sys
from sqlalchemy import create_engine
import pandas as pd

url = "postgresql+psycopg://neondb_owner:npg_byOpDx6i0MjE@ep-green-poetry-aysna7v3-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(url)
with engine.connect() as conn:
    print('Users:', pd.read_sql('SELECT COUNT(*) FROM users', conn).iloc[0,0])
    print('Complaints:', pd.read_sql('SELECT COUNT(*) FROM complaints', conn).iloc[0,0])
    print('Issue Clusters:', pd.read_sql('SELECT COUNT(*) FROM issue_clusters', conn).iloc[0,0])
