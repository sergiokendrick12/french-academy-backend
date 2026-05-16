f = open('app/admin/page.js', 'r', encoding='utf-8')
c = f.read()
f.close()

old = '      </div>\n      {showCreate&&('
new = '      </div>}\n      {showCreate&&('
c = c.replace(old, new, 1)

f = open('app/admin/page.js', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done! Count:', c.count('</div>}\n      {showCreate&&('))
