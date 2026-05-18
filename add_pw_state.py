f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add pwForm state
old1 = '  const [profileSaving,setProfileSaving]=useState(false);'
new1 = '  const [profileSaving,setProfileSaving]=useState(false);\n  const [pwForm,setPwForm]=useState({current:"",newPw:"",confirm:""});\n  const [pwSaving,setPwSaving]=useState(false);\n  const [pwMsg,setPwMsg]=useState("");'
count1 = c.count(old1)
print('state found:', count1)
c = c.replace(old1, new1, 1)

# Add changePassword function after saveProfile
old2 = '  const fetchData=async(id)=>{'
new2 = '''  const changePassword=async()=>{
    if(pwForm.newPw!==pwForm.confirm){setPwMsg("Passwords don\'t match");return;}
    if(pwForm.newPw.length<8){setPwMsg("Min 8 characters");return;}
    setPwSaving(true);setPwMsg("");
    try{
      const r=await fetch("/api/student/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId:student._id,currentPassword:pwForm.current,newPassword:pwForm.newPw})});
      const d=await r.json();
      if(d.success){setPwMsg("✅ Password updated!");setPwForm({current:"",newPw:"",confirm:""});setStudent(s=>({...s,passwordHash:"set"}));}
      else setPwMsg(d.error||"Failed");
    }catch{setPwMsg("Connection error");}
    finally{setPwSaving(false);}
  };
  const fetchData=async(id)=>{'''
count2 = c.count('  const fetchData=async(id)=>{')
print('fetchData found:', count2)
c = c.replace('  const fetchData=async(id)=>{', new2, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
