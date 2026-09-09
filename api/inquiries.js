import nodemailer from 'nodemailer';

// Reuse the transporter across warm invocations
let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.GMAIL_USER,        // your full Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // 16-character Gmail App Password
      },
      connectionTimeout: 8000, // fail fast instead of hanging
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }
  return transporter;
}

export default async function handler(req, res) {
  // Basic CORS support so the HTML site (hosted elsewhere) can call this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { name, company, email, phone, service, message } = req.body || {};

  if (!name || !email || !service) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  const textContent = `New inquiry received from the website:

Name:    ${name}
Company: ${company || '-'}
Email:   ${email}
Phone:   ${phone || '-'}
Service: ${service}

Message:
${message || '-'}
`;

  try {
    await getTransporter().sendMail({
      from: `"DLM Website" <${process.env.GMAIL_USER}>`,
      to: process.env.INQUIRY_NOTIFY_TO || process.env.GMAIL_USER,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: textContent,
    });

    return res.status(200).json({ status: 'sent' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ status: 'error', message: 'Could not send email. Please try again later.' });
  }
}
