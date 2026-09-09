import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  const {
    name,
    company,
    email,
    phone,
    service,
    message,
  } = req.body || {};

  // Validate required fields
  if (!name || !email || !service) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  try {
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify Gmail connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.INQUIRY_NOTIFY_TO || process.env.GMAIL_USER,

      replyTo: email,

      subject: `New inquiry from ${name}`,

      text: `
New inquiry received from the DLM website.

Name: ${name}
Company: ${company || "-"}
Email: ${email}
Phone: ${phone || "-"}
Service: ${service}

Message:
${message || "-"}
      `,

      html: `
        <h2>New Website Inquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || "-"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "-"}</p>
        <p><strong>Service:</strong> ${service}</p>

        <h3>Message</h3>
        <p>${message || "-"}</p>
      `,
    });

    return res.status(200).json({
      status: "sent",
      message: "Inquiry sent successfully",
    });

  } catch (error) {
    console.error("Gmail error:", error);

    return res.status(500).json({
      status: "error",
      message: "Could not send email. Please try again later.",
    });
  }
}
