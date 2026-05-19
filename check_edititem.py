f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
# Check if editItem is defined in PaymentsPage
idx = c.find('PaymentsPage({')
chunk = c[idx:idx+300]
print('PaymentsPage start:', repr(chunk))
# Check editItem state near PaymentsPage
idx2 = c.find('editItem,setEditItem', idx)
print('editItem in PaymentsPage at:', idx2)
