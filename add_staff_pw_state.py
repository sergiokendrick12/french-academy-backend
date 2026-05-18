f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add password state
old1 = '  const [profileSaving,setProfileSaving] = useState(false);\n  const [profileForm,setProfileForm] = useState({});'
new1 = '  const [profileSaving,setProfileSaving] = useState(false);\n  const [profileForm,setProfileForm] = useState({});\n  const [staffPwForm,setStaffPwForm] = useState({current:"",newPw:"",confirm:""});\n  const [staffPwSaving,setStaffPwSaving] = useState(false);\n  const [staffPwMsg,setStaffPwMsg] = useState("");'
count1 = c.count(old1)
print('state found:', count1)
c = c.replace(old1, new1, 1)

# Add changePassword function before fetchData
old2 = '  const fetchData=async(id)=>{'
new2 = '''  const changeStaffPassword=async()=>{
    if(staffPwForm.newPw!==staffPwForm.confirm){setStaffPwMsg("Passwords don\'t match");return;}
    if(staffPwForm.newPw.length<8){setStaffPwMsg("Min 8 characters");return;}
    setStaffPwSaving(true);setStaffPwMsg("");
    try{
      const r=await fetch("/api/staff/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({staffId:staff._id,currentPassword:staffPwForm.current,newPassword:staffPwForm.newPw})});
      const d=await r.json();
      if(d.success){setStaffPwMsg("✅ Password updated!");setStaffPwForm({current:"",newPw:"",confirm:""});}
      else setStaffPwMsg(d.error||"Failed");
    }catch{setStaffPwMsg("Connection error");}
    finally{setStaffPwSaving(false);}
  };
  const fetchData=async(id)=>{'''
count2 = c.count('  const fetchData=async(id)=>{')
print('fetchData found:', count2)
c = c.replace('  const fetchData=async(id)=>{', new2, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
