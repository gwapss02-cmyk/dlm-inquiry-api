import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    console.log("ENV GMAIL_USER present:", !!process.env.GMAIL_USER);
    console.log("ENV INQUIRY_NOTIFY_TO present:", !!process.env.INQUIRY_NOTIFY_TO);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      // optional debug
      logger: true,
      debug: true,
    });

    // verify connection configuration
    await transporter.verify();
    console.log("Transporter verified");

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.INQUIRY_NOTIFY_TO,
      subject: `New inquiry from ${req.body.name || "website"}`,
      text: JSON.stringify(req.body, null, 2),
    });

    console.log("sendMail info:", info);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "email_error", message: String(err) });
  }
}
