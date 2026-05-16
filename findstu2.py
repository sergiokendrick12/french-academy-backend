f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Find the resources tab section and replace with real data fetcher
old = 'const staticResources = ['
if old in c:
    print('found staticResources')
else:
    # Find what's around Study Resources
    idx = c.find('Study Resources')
    out = open('student_res.txt', 'w', encoding='utf-8')
    out.write(c[idx-500:idx+100])
    out.close()
    print('check student_res.txt')
