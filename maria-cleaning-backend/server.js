const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message } = req.body;

    // Validation
    if (!name || !email || !phone || !service) {
      return res.status(400).json({
        error:
          "Missing required fields: name, email, phone, and service are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Service type mapping
    const serviceTypes = {
      residential: "Residential Cleaning",
      deep: "Deep Cleaning",
      moveinout: "Move-In/Out Cleaning",
      commercial: "Commercial Cleaning",
    };

    const serviceName = serviceTypes[service] || service;

    // Email content to Maria Cleaning Service
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "service@hillviewgroupinc.com",
      subject: `🧹 New Booking Request - ${serviceName}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2eb8b8; border-bottom: 3px solid #2eb8b8; padding-bottom: 10px;">
                        New Booking Request
                    </h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold; width: 150px;">
                                    👤 Name:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    ${name}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold;">
                                    📧 Email:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    <a href="mailto:${email}" style="color: #2eb8b8;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold;">
                                    📱 Phone:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    <a href="tel:${phone}" style="color: #2eb8b8;">${phone}</a>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #e8f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Service Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold; width: 150px;">
                                    🧹 Service Type:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    ${serviceName}
                                </td>
                            </tr>
                            ${
                              date
                                ? `
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold;">
                                    📅 Preferred Date:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    ${new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              time
                                ? `
                            <tr>
                                <td style="padding: 8px 0; color: #666; font-weight: bold;">
                                    🕐 Preferred Time:
                                </td>
                                <td style="padding: 8px 0; color: #333;">
                                    ${time}
                                </td>
                            </tr>
                            `
                                : ""
                            }
                        </table>
                    </div>

                    ${
                      message
                        ? `
                    <div style="background-color: #fff9e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">💬 Additional Notes</h3>
                        <p style="color: #333; line-height: 1.6; margin: 0;">
                            ${message.replace(/\n/g, "<br>")}
                        </p>
                    </div>
                    `
                        : ""
                    }

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
                        <p style="margin: 5px 0;">
                            <strong>Submitted:</strong> ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
                        </p>
                        <p style="margin: 5px 0;">
                            Please respond to this customer within 24 hours.
                        </p>
                    </div>
                </div>
            `,
      text: `
NEW BOOKING REQUEST

Customer Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Service Details:
- Service Type: ${serviceName}
${date ? `- Preferred Date: ${date}` : ""}
${time ? `- Preferred Time: ${time}` : ""}

${message ? `Additional Notes:\n${message}` : ""}

Submitted: ${new Date().toLocaleString()}
            `,
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Maria Cleaning Services",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2eb8b8; border-bottom: 3px solid #2eb8b8; padding-bottom: 10px;">
                        ✨ Thank You, ${name}!
                    </h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        We've received your booking request for <strong>${serviceName}</strong> and we're excited to help make your space spotless!
                    </p>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
                        <ol style="color: #666; line-height: 1.8; padding-left: 20px;">
                            <li>Our team will review your request</li>
                            <li>We'll contact you within 24 hours via phone or email</li>
                            <li>We'll confirm your preferred date and time</li>
                            <li>We'll provide a detailed quote for your service</li>
                        </ol>
                    </div>

                    <div style="background-color: #e8f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Your Request Summary</h3>
                        <p style="color: #666; margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
                        ${date ? `<p style="color: #666; margin: 5px 0;"><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString()}</p>` : ""}
                        ${time ? `<p style="color: #666; margin: 5px 0;"><strong>Preferred Time:</strong> ${time}</p>` : ""}
                    </div>

                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Have questions? Feel free to reach out:
                    </p>
                    <p style="color: #666; margin: 5px 0;">📞 <strong>Phone:</strong> (555) 123-4567</p>
                    <p style="color: #666; margin: 5px 0;">📧 <strong>Email:</strong> service@hillviewgroupinc.com</p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 14px;">
                        <p>Maria Cleaning Services - Making your space spotless, one room at a time.</p>
                    </div>
                </div>
            `,
      text: `
Thank you, ${name}!

We've received your booking request for ${serviceName}.

What happens next?
1. Our team will review your request
2. We'll contact you within 24 hours
3. We'll confirm your preferred date and time
4. We'll provide a detailed quote

Your Request Summary:
- Service: ${serviceName}
${date ? `- Preferred Date: ${date}` : ""}
${time ? `- Preferred Time: ${time}` : ""}

Questions? Contact us:
Phone: (555) 123-4567
Email: service@hillviewgroupinc.com

Maria Cleaning Services
            `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(customerMailOptions);

    console.log(`✅ Booking request sent successfully for ${name}`);

    res.status(200).json({
      success: true,
      message: "Booking request sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      error: "Failed to send booking request. Please try again later.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🧹 Maria Cleaning Services - Backend Server         ║
║  ✅ Server running on http://localhost:${PORT}        ║
║  📧 Email notifications configured                    ║
║  🔗 API Endpoint: POST /api/contact                   ║
╚═══════════════════════════════════════════════════════╝
    `);
});
