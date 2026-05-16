f = open('app/student/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Replace the static avatar with a clickable photo upload
old = '<div className="profile-avatar-big">{initials(student.firstName,student.lastName)}</div>'
new = '''<div style={{position:"relative",display:"inline-block",marginBottom:8}}>
                  {student.photo?
                    <img src={student.photo} alt="profile" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--gold)"}}/>:
                    <div className="profile-avatar-big">{initials(student.firstName,student.lastName)}</div>
                  }
                  {profileEdit&&(
                    <label style={{position:"absolute",bottom:0,right:0,background:"var(--gold)",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>
                      📷
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                        const file=e.target.files[0];
                        if(!file) return;
                        const reader=new FileReader();
                        reader.onload=ev=>setProfileForm(p=>({...p,photo:ev.target.result}));
                        reader.readAsDataURL(file);
                      }}/>
                    </label>
                  )}
                </div>'''
c = c.replace(old, new, 1)

f = open('app/student/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('photo upload:', c.count('type="file"'))
