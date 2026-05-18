f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add password state
old1 = "const [email,setEmail]=useState(\"\");"
new1 = "const [email,setEmail]=useState(\"\");\n  const [password,setPassword]=useState(\"\");\n  const [showPwField,setShowPwField]=useState(false);\n  const [firstLogin,setFirstLogin]=useState(false);"
count1 = c.count(old1)
print('email state found:', count1)
c = c.replace(old1, new1, 1)

# Update login function to send password
old2 = 'body:JSON.stringify({email})'
new2 = 'body:JSON.stringify({email,password})'
count2 = c.count(old2)
print('login body found:', count2)
c = c.replace(old2, new2, 1)

# Handle firstLogin response
old3 = 'if(d.success){\n        setStudent(d.student);'
new3 = 'if(d.success){\n        if(d.firstLogin){setShowPwField(true);setFirstLogin(true);setLoading(false);return;}\n        setStudent(d.student);'
count3 = c.count(old3)
print('success handler found:', count3)
c = c.replace(old3, new3, 1)

# Handle need password (no passwordHash)
old4 = "else setErr(d.error||\"Login failed\");"
new4 = "else if(d.error===\"Password required\"){setShowPwField(true);setLoading(false);return;}\n      else setErr(d.error||\"Login failed\");"
count4 = c.count(old4)
print('error handler found:', count4)
c = c.replace(old4, new4, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
