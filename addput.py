f = open('app/api/admin/certifications/route.js', 'r', encoding='utf-8')
c = f.read()
f.close()
put = '''
export async function PUT(req) {
  try {
    await connectDB();
    const { _id, ...update } = await req.json();
    const certification = await Certification.findByIdAndUpdate(_id, update, { new: true });
    return NextResponse.json({ success: true, certification });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}'''
f = open('app/api/admin/certifications/route.js', 'w', encoding='utf-8')
f.write(c + put)
f.close()
print('Done!')
