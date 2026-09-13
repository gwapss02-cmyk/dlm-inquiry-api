import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: process.env.INQUIRY_NOTIFY_TO,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: textContent,
    });

    return res.status(200).json({ status: 'sent' });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ status: 'error', message: 'Could not send email. Please try again later.' });
  }
}
