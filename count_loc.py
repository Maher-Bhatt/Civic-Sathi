import os

def count_lines(directories):
    total_lines = 0
    extensions = {'.ts', '.tsx', '.py', '.js', '.jsx', '.html', '.css', '.json'}
    exclude_dirs = {'node_modules', '.git', 'dist', 'build', '.next', '.gemini'}
    
    for directory in directories:
        if not os.path.exists(directory): continue
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in extensions:
                    path = os.path.join(root, file)
                    try:
                        with open(path, 'r', encoding='utf-8') as f:
                            total_lines += sum(1 for _ in f)
                    except Exception:
                        pass
    return total_lines

if __name__ == "__main__":
    base = r"C:\Users\maher\OneDrive\Desktop\JANMIND"
    dirs = [
        os.path.join(base, "apps"),
        os.path.join(base, "packages"),
        os.path.join(base, "backend"),
        os.path.join(base, "components"), # if any
    ]
    count = count_lines(dirs)
    print(f"Total Lines of Code in apps, packages, and backend: {count}")
