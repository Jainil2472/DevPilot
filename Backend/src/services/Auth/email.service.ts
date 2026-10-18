import nodemailer from 'nodemailer';
import 'dotenv/config';


const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM
} = process.env;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
})


export async function verificationMail(to: string, verificationLink: string) {

    
const result = await transporter.sendMail({
  from: SMTP_FROM,
  to,
  subject: "Verify Your Email - DevPilot",
  text: `
Welcome to DevPilot! We're very excited to have you on board.

To complete your registration and secure your account, please visit:
${verificationLink}

This link will expire in 24 hours. If you did not create an account for DevPilot, please safely ignore this email.
  `.trim(),
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Welcome to DevPilot!</h2>

      <p>We're very excited to have you on board.</p>

      <p>
        To complete your registration and secure your account,
        please click the button below:
      </p>

      <a
        href="${verificationLink}"
        style="
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Verify Your Email
      </a>

      <p>This link will expire in 1 hour.</p>

      <p>
        If you did not create an account for DevPilot,
        please safely ignore this email.
      </p>
    </div>
  `,
});

return {
    messageID: result.messageId,
    accepted: result.accepted,
};
    
}