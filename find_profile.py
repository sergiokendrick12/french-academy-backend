f = open('app/staff/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '          {tab==="profile"&&('
new = '''          {tab==="marks"&&('''

# Find profile tab content start
idx = c.find('          {tab==="profile"&&(')
print('profile tab found:', idx)
# Find where to insert change password - after the save profile buttons
idx2 = c.find('Your staff information')
print('staff info found:', idx2)
