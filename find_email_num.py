import os
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.js') and 'node_modules' not in root and '.next' not in root:
            path = os.path.join(root, f)
            try:
                c = open(path, 'r', encoding='utf-8').read()
                if '785 302 957' in c:
                    print(path)
            except: pass
