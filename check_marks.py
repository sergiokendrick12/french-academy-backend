f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
idx = c.find('quizResult')
print('quizResult count:', c.count('quizResult'))
# Find where data is fetched
idx2 = c.find('fetchData')
print(repr(c[idx2:idx2+300]))
