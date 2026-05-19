import os
path = 'app/api/admin/payments'
files = os.listdir(path)
print(files)
for f in files:
    content = open(f"{path}/{f}", encoding="utf-8").read()
    print(f"=== {f} ===")
    print(content[:500])
