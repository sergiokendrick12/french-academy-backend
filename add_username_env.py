f = open('.env.local', 'r', encoding='utf-8')
c = f.read()
f.close()

c += '\nADMIN_USERNAME=admin'
f = open('.env.local', 'w', encoding='utf-8')
f.write(c)
f.close()
print('Done!')
