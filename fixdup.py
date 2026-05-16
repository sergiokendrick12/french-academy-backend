f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
bad = '''  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };
  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };'''
good = '''  const deleteResult = async (id) => { if(!confirm("Delete this result?")) return; await fetch("/api/admin/certifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}); fetchTracking(); toast("Result deleted!","success"); };
  const saveEdit = async () => { await fetch("/api/admin/certifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editItem)}); setEditItem(null); fetchTracking(); toast("Result updated!","success"); };'''
c = c.replace(bad, good, 1)
f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! deleteResult count:', c.count('const deleteResult'))
