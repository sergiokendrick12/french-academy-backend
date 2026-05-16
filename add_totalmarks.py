f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Add totalMarks to form state
old1 = 'const [form,setForm]=useState({title:"",description:"",duration:30,active:true});'
new1 = 'const [form,setForm]=useState({title:"",description:"",duration:30,active:true,totalMarks:0});'
c = c.replace(old1, new1, 1)

# Add Total Marks input after Duration field
old2 = '<div className="form-group"><label className="form-label">Duration (minutes)</label><input className="form-input" type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})}/></div>'
new2 = '<div className="form-group"><label className="form-label">Duration (minutes)</label><input className="form-input" type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})}/></div><div className="form-group"><label className="form-label">Total Marks</label><input className="form-input" type="number" min="0" placeholder="e.g. 10" value={form.totalMarks} onChange={e=>setForm({...form,totalMarks:Number(e.target.value)})}/></div>'
c = c.replace(old2, new2, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
print('totalMarks in form:', c.count('totalMarks'))
