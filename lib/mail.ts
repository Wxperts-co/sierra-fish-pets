import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // Set to true if port is 465 (SSL)

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL certificate checks for hijacked/proxied mail servers
  },
  connectionTimeout: 5000, // 5 seconds connection timeout
  greetingTimeout: 5000,   // 5 seconds greeting timeout
  socketTimeout: 8000,     // 8 seconds socket timeout
});