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
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; box-sizing: border-box; padding: 10px;">
                <div style="background-color: #002244; padding: 20px 16px; text-align: center; border-radius: 12px 12px 0 0;">
                  <img src="${logoUrl}" alt="Sierra Fish &amp; Pets" style="max-height: 48px; width: auto; margin-bottom: 8px; display: inline-block;" />
                  <p style="color: #00aaff; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Special Order Inquiry Confirmation</p>
                </div>
                
                <div style="padding: 20px 16px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff; box-sizing: border-box;">
                  <p style="font-size: 15px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
                  
                  <p style="font-size: 14px; color: #334155;">Thank you for submitting your special order request for <strong>${speciesTitle}</strong> with Sierra Fish &amp; Pets!</p>
                  
                  <p style="font-size: 13px; color: #475569;">Our livestock specialists are checking current availability and pricing with our certified breeder and importer network. We will follow up with you shortly at <strong>${phone || email}</strong> with details.</p>
                  
                  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin: 18px 0; word-break: break-word; overflow-wrap: anywhere;">
                    <h4 style="margin: 0 0 10px 0; color: #003B73; font-size: 14px;">Summary of Your Inquiry:</h4>
                    <div style="font-size: 13px; color: #475569; line-height: 1.6;">
                      <div style="margin-bottom: 6px;"><strong>Requested Species:</strong> ${speciesTitle}</div>
                      <div style="margin-bottom: 6px;"><strong>Customer Name:</strong> ${name}</div>
                      <div style="margin-bottom: 6px;"><strong>Phone:</strong> ${phone || "N/A"}</div>
                      <div style="margin-bottom: 6px;"><strong>Email:</strong> ${email}</div>
                      ${notes ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1;"><strong>Notes / Preferences:</strong> ${notes}</div>` : ""}
                    </div>
                  </div>
                  
                  <p style="font-size: 13px; color: #64748b;">If you have additional questions, feel free to reply directly to this email or call us at <strong>425-226-3215</strong>.</p>
                  
                  <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
                    Sierra Fish &amp; Pets • 601 S Grady Way Suite M, Renton, WA 98057
                  </div>
                </div>
              </div>
            `,
          }),

          // 2. Admin Notification Email (100% Mobile Responsive)
          transporter.sendMail({
            from: `"Sierra Web Inquiry" <${fromEmail}>`,
            to: adminEmail,
            subject: `New Special Order Inquiry: ${speciesTitle} (${name})`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background-color: #f8fafc; padding: 12px 6px; box-sizing: border-box;">
                <div style="background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                  
                  <!-- Header -->
                  <div style="background-color: #002244; padding: 22px 16px; text-align: center;">
                    <img src="${logoUrl}" alt="Sierra Fish &amp; Pets" style="max-height: 46px; width: auto; margin-bottom: 10px; display: inline-block;" />
                    <div>
                      <span style="display: inline-block; background-color: rgba(0, 170, 255, 0.15); border: 1px solid rgba(0, 170, 255, 0.3); color: #00aaff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 30px; letter-spacing: 1px;">
                        New Special Order Inquiry
                      </span>
                    </div>
                  </div>

                  <!-- Content Body -->
                  <div style="padding: 20px 16px; box-sizing: border-box;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Requested Item / Species
                    </p>

                    <!-- Species Hero Box -->
                    <div style="background-color: #f0f7ff; border: 1px solid #bae6fd; border-left: 4px solid #005AA9; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; word-break: break-word; overflow-wrap: anywhere;">
                      <h2 style="margin: 0; color: #002244; font-size: 18px; font-weight: 800; line-height: 1.3;">
                        ${speciesTitle}
                      </h2>
                    </div>

                    <!-- Customer Details (Mobile Responsive Cards) -->
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                      Customer Details
                    </p>
                    
                    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; margin-bottom: 20px;">
                      <!-- Name Row -->
                      <div style="padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff; word-break: break-word; overflow-wrap: anywhere;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Customer Name</span>
                        <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${name}</span>
                      </div>
                      
                      <!-- Phone Row -->
                      <div style="padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background-color: #fafcff; word-break: break-word; overflow-wrap: anywhere;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Phone Number</span>
                        <span style="font-size: 14px; font-weight: 700;">
                          ${phone ? `<a href="tel:${phone}" style="color: #005AA9; text-decoration: none;">${phone}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
                        </span>
                      </div>

                      <!-- Email Row -->
                      <div style="padding: 12px 14px; background-color: #ffffff; word-break: break-word; overflow-wrap: anywhere;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Email Address</span>
                        <span style="font-size: 14px; font-weight: 700;">
                          <a href="mailto:${email}" style="color: #005AA9; text-decoration: none; word-break: break-all;">${email}</a>
                        </span>
                      </div>
                    </div>

                    ${notes ? `
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Customer Notes &amp; Preferences
                      </p>
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 20px; word-break: break-word; overflow-wrap: anywhere;">
                        ${notes}
                      </div>
                    ` : ""}

                    <!-- Direct Action Buttons (Mobile Wrap Safe) -->
                    <div style="text-align: center; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9;">
                      <a href="mailto:${email}?subject=Re:%20Special%20Order%20Inquiry%20-%20${encodeURIComponent(speciesTitle)}" style="display: inline-block; background-color: #005AA9; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 11px 20px; border-radius: 25px; margin: 4px; box-shadow: 0 2px 6px rgba(0,90,169,0.25);">
                        Reply to Customer
                      </a>
                      ${phone ? `
                        <a href="tel:${phone}" style="display: inline-block; background-color: #f1f5f9; color: #0f172a; text-decoration: none; font-weight: bold; font-size: 13px; padding: 11px 20px; border-radius: 25px; margin: 4px; border: 1px solid #cbd5e1;">
                          Call Customer
                        </a>
                      ` : ""}
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f8fafc; padding: 14px 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
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
