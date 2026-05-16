f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix 1: Replace the brittle getElementById auto-submit with a proper useEffect
old = '''const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);document.getElementById("quiz-submit-btn")?.click();return 0;}return p-1;});},1000);'''
new = '''const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);'''
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Step 1 done:', c.count('setQuizTimeLeft'))
