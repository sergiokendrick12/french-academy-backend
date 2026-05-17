f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = "changePwd = async () => {\n    if(pwd.newPwd!==pwd.confirm){toast(\"Passwords don't match\",\"error\");return;}\n    if(pwd.newPwd.length<8){toast(\"Password too short\",\"error\");return;}\n    toast(\"Password change requires backend update — contact your developer\",\"info\");\n    setPwd({current:\"\",newPwd:\"\",confirm:\"\"});\n  };"
new = """changePwd = async () => {
    if(pwd.newPwd!==pwd.confirm){toast("Passwords don't match","error");return;}
    if(pwd.newPwd.length<8){toast("Min 8 characters","error");return;}
    if(!pwd.current){toast("Enter current password","error");return;}
    try{
      const r=await fetch("/api/admin/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:pwd.current,newPassword:pwd.newPwd})});
      const d=await r.json();
      if(d.success){toast("Password updated!","success");setPwd({current:"",newPwd:"",confirm:""});}
      else toast(d.error||"Failed","error");
    }catch{toast("Connection error","error");}
  };"""
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
