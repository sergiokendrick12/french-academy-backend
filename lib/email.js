import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendAdminNotification(enrollment) {
  const { firstName, lastName, email, phone, certificationGoal, message } = enrollment;

  await transporter.sendMail({
    from: `"IFA Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `🎓 New Enrollment Request — ${firstName} ${lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: #c9a84c; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #0d1b2a; font-size: 22px;">New Enrollment Request</h1>
          <p style="margin: 4px 0 0; color: #0d1b2a; font-size: 14px;">International French Academy — Kigali</p>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #c9a84c; font-weight: bold; width: 40%;">Full Name</td><td style="padding: 10px 0;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 10px 0; color: #c9a84c; font-weight: bold;">Email</td><td style="padding: 10px 0;">${email}</td></tr>
            <tr><td style="padding: 10px 0; color: #c9a84c; font-weight: bold;">Phone / WhatsApp</td><td style="padding: 10px 0;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; color: #c9a84c; font-weight: bold;">Certification Goal</td><td style="padding: 10px 0;">${certificationGoal}</td></tr>
            ${message ? `<tr><td style="padding: 10px 0; color: #c9a84c; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 10px 0;">${message}</td></tr>` : ""}
          </table>
        </div>
      </div>
    `,
  });
}

export async function sendStudentConfirmation(enrollment) {
  const { firstName, lastName, email, certificationGoal } = enrollment;

  await transporter.sendMail({
    from: `"International French Academy" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `✅ We received your enrollment request — IFA Kigali`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: #c9a84c; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #0d1b2a; font-size: 22px;">Enrollment Received!</h1>
          <p style="margin: 4px 0 0; color: #0d1b2a; font-size: 14px;">International French Academy — Kigali, Rwanda</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Dear <strong>${firstName} ${lastName}</strong>,</p>
          <p style="font-size: 15px; color: #ccc;">Thank you for your interest in the <strong style="color: #c9a84c;">International French Academy</strong>! We received your enrollment request for <strong style="color: #c9a84c;">${certificationGoal}</strong>.</p>
          <p style="font-size: 15px; color: #ccc;">Our team will contact you within <strong>24–48 hours</strong>.</p>
          <div style="margin: 28px 0; padding: 20px; background: rgba(201,168,76,0.1); border-radius: 8px;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #c9a84c;">Contact Us Anytime</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📧 frenchacademyinternational@gmail.com</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📱 +250 785 302 957 (WhatsApp)</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📍 Norrsken House, Kigali</p>
          </div>
          <p style="font-size: 15px;">— The IFA Team 🇫🇷</p>
        </div>
      </div>
    `,
  });
}
export async function sendBulkEmail({ to, name, subject, message }) {
  await transporter.sendMail({
    from: `"International French Academy" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: #c9a84c; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #0d1b2a; font-size: 22px;">International French Academy</h1>
          <p style="margin: 4px 0 0; color: #0d1b2a; font-size: 14px;">Kigali, Rwanda</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
          <div style="font-size: 15px; color: #ccc; line-height: 1.8; white-space: pre-wrap;">${message}</div>
          <div style="margin: 28px 0; padding: 20px; background: rgba(201,168,76,0.1); border-radius: 8px; border-left: 3px solid #c9a84c;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #c9a84c;">International French Academy</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📧 frenchacademyinternational@gmail.com</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📱 +250 785 302 957 (WhatsApp)</p>
            <p style="margin: 4px 0; font-size: 14px; color: #ccc;">📍 Norrsken House · Sainte Famille, Kigali</p>
          </div>
          <p style="font-size: 14px; color: #888;">— The IFA Team 🇫🇷</p>
        </div>
      </div>
    `,
  });
}