# Create AdminConfig model
content = """import mongoose from "mongoose";
const AdminConfigSchema = new mongoose.Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });
export default mongoose.models.AdminConfig || mongoose.model("AdminConfig", AdminConfigSchema);
"""
f = open('models/AdminConfig.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Model created!')
