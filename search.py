import os

def search_files(root_dir, target_strings, extensions):
    results = set()
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in root or '.git' in root or '.next' in root or 'dist' in root or '.venv' in root or '__pycache__' in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for target in target_strings:
                            if target in content:
                                results.add(file_path)
                                break
                except Exception:
                    pass
    return list(results)

if __name__ == '__main__':
    apps_dir = r"C:\Users\maher\OneDrive\Desktop\Civic Sathi\apps"
    backend_dir = r"C:\Users\maher\OneDrive\Desktop\Civic Sathi\backend"
    
    apps_results = search_files(apps_dir, ["localStorage", "sessionStorage", "mockData", "dummyData", "fakeData", "demoData", "json-server"], ['.ts', '.tsx', '.js', '.jsx'])
    print("APPS MOCK/LOCALSTORAGE:")
    for res in apps_results:
        print(res)
        
    backend_results = search_files(backend_dir, ["mock", "dummy", "fake", "demo"], ['.py'])
    print("\nBACKEND MOCK/DUMMY:")
    for res in backend_results:
        print(res)
