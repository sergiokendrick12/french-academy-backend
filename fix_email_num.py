files = [
    'app/api/admin/send-email/route.js',
    'app/student/page.js',
    'lib/email.js'
]
for path in files:
    try:
        f = open(path, 'r', encoding='utf-8')
        c = f.read()
        f.close()
        count = c.count('785 302 957')
        if count > 0:
            c = c.replace('785 302 957', '785 632 172')
            f = open(path, 'w', encoding='utf-8')
            f.write(c)
            f.close()
            print(f'Fixed {count} in {path}')
    except Exception as e:
        print(f'Error {path}: {e}')
print('Done!')
