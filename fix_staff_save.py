f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

# Fix saveProfile to include photo
old = 'body:JSON.stringify({staffId:staff._id,phone:profilePhone})'
new = 'body:JSON.stringify({staffId:staff._id,phone:profilePhone,photo:profileForm?.photo||staff.photo||""})'
count = c.count(old)
print('saveProfile found:', count)
c = c.replace(old, new, 1)

# Fix setStaff to include photo
old2 = 'if(d.success){setStaff(s=>({...s,phone:profilePhone}));'
new2 = 'if(d.success){setStaff(s=>({...s,phone:profilePhone,photo:profileForm?.photo||s.photo}));'
count2 = c.count(old2)
print('setStaff found:', count2)
c = c.replace(old2, new2, 1)

f = open('app/staff/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
