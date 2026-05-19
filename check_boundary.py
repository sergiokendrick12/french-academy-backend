f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()
# Find where PaymentsPage ends
idx = c.find('PaymentsPage({')
end = c.find('\nfunction ', idx+1)
print('PaymentsPage ends at:', end)
print('Next function:', repr(c[end:end+60]))
# Find editItem usage inside PaymentsPage
edit_idx = c.find('editItem&&', idx, end)
print('editItem used in PaymentsPage at:', edit_idx)
print(repr(c[edit_idx-50:edit_idx+100]))
