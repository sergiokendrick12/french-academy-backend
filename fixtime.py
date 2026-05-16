f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '''const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);return 0;}return p-1;});},1000);'''
new = '''const t=setInterval(()=>{setQuizTimeLeft(p=>{if(p<=1){clearInterval(t);document.getElementById("quiz-submit-btn")?.click();return 0;}return p-1;});},1000);'''
c = c.replace(old, new, 1)

old2 = '<button className="btn btn-gold" style={{width:"100%",marginTop:8}} onClick={async()=>{'
new2 = '<button id="quiz-submit-btn" className="btn btn-gold" style={{width:"100%",marginTop:8}} onClick={async()=>{'
c = c.replace(old2, new2, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
