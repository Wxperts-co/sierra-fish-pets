import { transporter } from "@/lib/mail";

interface ContactEmailData {
name: string;
email: string;
message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
await transporter.sendMail({
from: process.env.SMTP_USER,
to: process.env.CONTACT_RECEIVER_EMAIL,
replyTo: data.email,
subject: `📩 New Contact Inquiry from ${data.name}`,
html: ` <div style="margin:0;padding:40px 0;background:#f4f8fc;font-family:Arial,Helvetica,sans-serif;"> <table width="100%" cellpadding="0" cellspacing="0"> <tr> <td align="center"> <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5edf5;">


            <tr>
              <td style="background:#005AA9;padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">
                  Sierra Fish & Pets
                </h1>
                <p style="margin:10px 0 0;color:#d9ecff;font-size:14px;">
                  New Contact Form Submission
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                
                <div style="background:#f8fbff;border:1px solid #e3eef9;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <h2 style="margin:0 0 16px;color:#002244;font-size:20px;">
                    Customer Information
                  </h2>

                  <p style="margin:8px 0;color:#334155;">
                    <strong>Name:</strong> ${data.name}
                  </p>

                  <p style="margin:8px 0;color:#334155;">
                    <strong>Email:</strong>
                    <a href="mailto:${data.email}" style="color:#005AA9;text-decoration:none;">
                      ${data.email}
                    </a>
                  </p>
                </div>

                <div style="background:#ffffff;border:1px solid #e3eef9;border-radius:12px;padding:20px;">
                  <h3 style="margin:0 0 16px;color:#002244;font-size:18px;">
                    Message
                  </h3>

                  <p style="margin:0;color:#475569;line-height:1.8;font-size:15px;white-space:pre-wrap;">
                    ${data.message}
                  </p>
                </div>

              </td>
            </tr>

            <tr>
              <td style="background:#f8fbff;padding:20px;text-align:center;border-top:1px solid #e5edf5;">
                <p style="margin:0;color:#64748b;font-size:13px;">
                  This message was submitted through the Sierra Fish & Pets website contact form.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,


});
}
