export default async function handler(req, res) {
  // Only allow POST
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
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'DLM Website' },
        to: [{ email: process.env.INQUIRY_NOTIFY_TO }],
        replyTo: { email },
        subject: `New inquiry from ${name}`,
        textContent,
      }),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text();
      console.error('Brevo error:', brevoRes.status, errBody);
      return res.status(500).json({ status: 'error', message: 'Could not send email. Please try again later.' });
    }

    return res.status(200).json({ status: 'sent' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ status: 'error', message: 'Could not send email. Please try again later.' });
  }
}
