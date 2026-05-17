import os
for root, dirs, files in os.walk('app/api/admin'):
    for f in files:
        print(os.path.join(root, f))
