f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix firstLogin to save password then login
old = 'if(d.firstLogin){setShowPwField(true);setFirstLogin(true);setLoading(false);return;}'
new = '''if(d.firstLogin){
          if(!password){setShowPwField(true);setFirstLogin(true);setLoading(false);return;}
          // Save password first then login
          const r2=await fetch("/api/student/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId:d.student._id,newPassword:password})});
          const d2=await r2.json();
          if(!d2.success){setErr(d2.error||"Failed to set password");setLoading(false);return;}
          setStudent(d.student);
          setProfileForm({firstName:d.student.firstName,lastName:d.student.lastName,email:d.student.email,phone:d.student.phone||""});
          fetchData(d.student._id);fetchAnnouncements();
          return;
        }'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
