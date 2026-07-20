import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, customSpecies, notes } = body;

    if (!name || !email || !customSpecies) {
      return NextResponse.json(
        { success: false, message: "Missing required inquiry fields." },
        { status: 400 }
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.CONTACT_RECEIVER_EMAIL ||
      "k17saurabh@gmail.com";
    const fromEmail = process.env.SMTP_USER || "no-reply@sierrafishnpets.com";
    const speciesTitle = customSpecies.trim();
    const logoUrl = "https://www.sierrafishandpets.com/images/logo/logo.png";

    // Dispatch emails asynchronously
    (async () => {
      try {
        const results = await Promise.allSettled([
          // 1. Customer Confirmation Email
          transporter.sendMail({
            from: `"Sierra Fish & Pets" <${fromEmail}>`,
            to: email,
            subject: `Special Order Inquiry Received: ${speciesTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <div style="background-color: #002244; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
                  <img src="${logoUrl}" alt="Sierra Fish &amp; Pets" style="max-height: 55px; width: auto; margin-bottom: 8px; display: inline-block;" />
                  <p style="color: #00aaff; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Special Order Inquiry Confirmation</p>
                </div>
                
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff;">
                  <p style="font-size: 15px;">Hello <strong>${name}</strong>,</p>
                  
                  <p>Thank you for submitting your special order request for <strong>${speciesTitle}</strong> with Sierra Fish &amp; Pets!</p>
                  
                  <p>Our livestock specialists are checking current availability and pricing with our certified breeder and importer network. We will follow up with you shortly at <strong>${phone || email}</strong> with details.</p>
                  
                  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #003B73; font-size: 14px;">Summary of Your Inquiry:</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569;">
                      <li><strong>Requested Item / Species:</strong> ${speciesTitle}</li>
                      <li><strong>Customer Name:</strong> ${name}</li>
                      <li><strong>Phone:</strong> ${phone || "N/A"}</li>
                      <li><strong>Email:</strong> ${email}</li>
                      ${notes ? `<li><strong>Notes / Preferences:</strong> ${notes}</li>` : ""}
                    </ul>
                  </div>
                  
                  <p style="font-size: 13px; color: #64748b;">If you have additional questions or photos of the species you want, feel free to reply directly to this email or call us at <strong>425-226-3215</strong>.</p>
                  
                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
                    Sierra Fish &amp; Pets • 601 S Grady Way Suite M, Renton, WA 98057
                  </div>
                </div>
              </div>
            `,
          }),

          // 2. Admin Notification Email
          transporter.sendMail({
            from: `"Sierra Web Inquiry" <${fromEmail}>`,
            to: adminEmail,
            subject: `New Special Order Inquiry: ${speciesTitle} (${name})`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1e293b; background-color: #f8fafc; padding: 20px 10px;">
                <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                  
                  <!-- Header -->
                  <div style="background-color: #002244; padding: 28px 24px; text-align: center;">
                    <img src="${logoUrl}" alt="Sierra Fish &amp; Pets" style="max-height: 52px; width: auto; margin-bottom: 12px; display: inline-block;" />
                    <div style="display: inline-block; background-color: rgba(0, 170, 255, 0.15); border: 1px solid rgba(0, 170, 255, 0.3); color: #00aaff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 14px; rounded-radius: 50px; letter-spacing: 1px;">
                      New Special Order Inquiry
                    </div>
                  </div>

                  <!-- Content Body -->
                  <div style="padding: 28px 24px;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Requested Item / Species
                    </p>

                    <!-- Species Hero Box -->
                    <div style="background-color: #f0f7ff; border: 1px solid #bae6fd; border-left: 5px solid #005AA9; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                      <h2 style="margin: 0; color: #002244; font-size: 20px; font-weight: 800;">
                        ${speciesTitle}
                      </h2>
                    </div>

                    <!-- Customer Contact Grid -->
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Customer Details
                    </p>
                    <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; background-color: #f8fafc; width: 140px; border-bottom: 1px solid #f1f5f9;">Customer Name</td>
                        <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${name}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">Phone Number</td>
                        <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #005AA9; border-bottom: 1px solid #f1f5f9;">
                          ${phone ? `<a href="tel:${phone}" style="color: #005AA9; text-decoration: none;">${phone}</a>` : "Not provided"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #475569; background-color: #f8fafc;">Email Address</td>
                        <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #005AA9;">
                          <a href="mailto:${email}" style="color: #005AA9; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                    </table>

                    ${notes ? `
                      <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Customer Notes &amp; Preferences
                      </p>
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
                        ${notes}
                      </div>
                    ` : ""}

                    <!-- Direct Reply Buttons -->
                    <div style="text-align: center; margin-top: 20px; padding-top: 16px;">
                      <a href="mailto:${email}?subject=Re:%20Special%20Order%20Inquiry%20-%20${encodeURIComponent(speciesTitle)}" style="display: inline-block; background-color: #005AA9; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 30px; margin-right: 8px; box-shadow: 0 2px 8px rgba(0,90,169,0.25);">
                        Reply to Customer
                      </a>
                      ${phone ? `
                        <a href="tel:${phone}" style="display: inline-block; background-color: #f1f5f9; color: #0f172a; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 30px; border: 1px solid #cbd5e1;">
                          Call Customer
                        </a>
                      ` : ""}
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0;">
                    Received on ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PST • Sierra Admin System
                  </div>
                </div>
              </div>
            `,
          }),
        ]);

        results.forEach((res, index) => {
          if (res.status === "rejected") {
            console.error(`Email #${index + 1} send failure:`, res.reason);
          } else {
            console.log(`Email #${index + 1} sent successfully.`);
          }
        });
      } catch (err) {
        console.error("Special order background email dispatch error:", err);
      }
    })();

    return NextResponse.json(
      { success: true, message: "Special order inquiry received. Email notification sent to admin and customer." },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/special-order-inquiry error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
