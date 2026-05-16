f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
old = '    const passRate = tracking.length > 0 ? Math.round((tracking.filter(t=>t.passed).length/tracking.length)*100) : 0;'
new = '''    const [editItem,setEditItem] = useState(null);
    const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
    const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
    const passRate = tracking.length > 0 ? Math.round((tracking.filter(t=>t.passed).length/tracking.length)*100) : 0;'''
c = c.replace(old, new, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
