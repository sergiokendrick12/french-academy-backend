export async function sendWhatsAppNotification(enrollment) {
  const { firstName, lastName, phone, certificationGoal } = enrollment;

  const apiKey = process.env.CALLMEBOT_APIKEY;
  const whatsappNumber = process.env.ACADEMY_WHATSAPP_NUMBER;

  if (!apiKey || !whatsappNumber) {
    console.warn("WhatsApp notification skipped: missing CALLMEBOT_APIKEY or ACADEMY_WHATSAPP_NUMBER");
    return;
  }

  const message = `🎓 New Enrollment!\n\nName: ${firstName} ${lastName}\nPhone: ${phone}\nGoal: ${certificationGoal}\n\nCheck admin dashboard for full details.`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${encodedMessage}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("WhatsApp notification failed:", await res.text());
    }
  } catch (err) {
    console.error("WhatsApp notification error:", err.message);
  }
}