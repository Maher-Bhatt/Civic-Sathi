import requests

try:
    res = requests.get('https://civic-sathi-f7ml.onrender.com/api/v1/admin/snapshot', headers={'Authorization': 'Bearer Jm#9kP2@vRqL5nXwY7sZ0tAeB3cDfGhIuMoNpQrStUvWxYz4_2026_prod'})
    print("Snapshot:", res.json())
except Exception as e:
    print(e)
