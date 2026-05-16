content = '''import mongoose from "mongoose";
const ResourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, default: "PDF" },
  level: { type: String, default: "All levels" },
  url: String,
}, { timestamps: true });
export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);'''
f = open('models/Resource.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
