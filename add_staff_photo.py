f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# 1. Add photo to staff form state
old1 = "const [form,setForm]=useState({name:'',role:'',email:'',phone:'',classes:0});"
new1 = "const [form,setForm]=useState({name:'',role:'',email:'',phone:'',classes:0,photo:''});"
c = c.replace(old1, new1, 1)
print('form state:', c.count("photo:''"))

# 2. Add photo upload field in Add Staff form after Full Name
old2 = '<div className="form-group" style={{gridColumn:"span 2"}}>\n                <label className="form-label">Role</label>'
new2 = '<div className="form-group" style={{gridColumn:"span 2"}}><label className="form-label">Photo (optional)</label><div style={{display:"flex",alignItems:"center",gap:12}}>{form.photo&&<img src={form.photo} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover"}} alt=""/>}<label style={{background:"var(--ink3)",border:"1px solid var(--border2)",color:"var(--text2)",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12}}>Upload Photo<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>setForm(p=>({...p,photo:ev.target.result}));reader.readAsDataURL(file);}}/></label></div></div><div className="form-group" style={{gridColumn:"span 2"}}>\n                <label className="form-label">Role</label>'
c = c.replace(old2, new2, 1)
print('photo upload in form:', c.count('Upload Photo'))

# 3. Show photo on staff cards instead of initials
old3 = '<div style={{width:64,height:64,borderRadius:"50%",background:"rgba(201,168,67,0.15)",border:"2px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-d)",fontSize:20,color:"var(--gold)",marginBottom:8}}>{initials(s.name)}</div>'
new3 = '<div style={{width:64,height:64,borderRadius:"50%",background:"rgba(201,168,67,0.15)",border:"2px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-d)",fontSize:20,color:"var(--gold)",marginBottom:8,overflow:"hidden",padding:0}}>{s.photo?<img src={s.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:initials(s.name)}</div>'
count3 = c.count(old3)
print('staff card avatar found:', count3)
c = c.replace(old3, new3, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
