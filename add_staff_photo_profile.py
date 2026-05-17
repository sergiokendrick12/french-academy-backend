f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '<div className="profile-avatar-big">{initials(staff.name)}</div>'
new = '''<div style={{position:"relative",display:"inline-block",marginBottom:8}}>
                  {staff.photo?
                    <img src={staff.photo} alt="profile" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--blue)"}}/> :
                    <div className="profile-avatar-big">{initials(staff.name)}</div>
                  }
                  <label style={{position:"absolute",bottom:0,right:0,background:"var(--blue)",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>
                    📷
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                      const file=e.target.files[0];
                      if(!file) return;
                      const reader=new FileReader();
                      reader.onload=ev=>setProfileForm(p=>({...p,photo:ev.target.result}));
                      reader.readAsDataURL(file);
                    }}/>
                  </label>
                </div>'''
count = c.count(old)
print('Found:', count)
c = c.replace(old, new, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
