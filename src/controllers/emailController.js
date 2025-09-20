const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  const {
    to, // array of emails
    subject,
    text,
    username,
    password,
    owner,
    banner,
    shopName,
    logo,
    btnName,
    color,
    btnUrl,
  } = req.body;

  // ===== Validations =====
  const nameRegex = /^[A-Za-z\s]+$/;
  const urlRegex = /^(https?:\/\/[^\s]+)/i;
  const imageRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))(?:\?.*)?$/i;

  const nameMail = nameRegex.test(shopName) ? shopName : "";
  const logoborder = logo && imageRegex.test(logo) ? "block" : "none";
  const imgBanner = banner && imageRegex.test(banner) ? "block" : "none";
  const buttonRedirect = urlRegex.test(btnUrl) ? btnUrl : "";
  const buttonVisible = btnName && btnName.trim() !== "" ? "block" : "none";

  // Nodemailer Transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: { user: username, pass: password },
  });

  // HTML Template
  const emailHtml = `
  <html>
    <body style="font-family: Arial, sans-serif; background:#f9f9f9;">
      <div style="max-width:600px; margin:50px auto; background:#fff; border-radius:10px; border:1px solid #ddd;">
        <div style="background:${color || "black"}; padding:15px; border-radius:10px 10px 0 0; text-align:center;">
          <img src="${logo}" alt="logo" style="width:50px;height:50px;border-radius:50%;display:${logoborder};"/>
        </div>
        <h2 style="text-align:center; margin:20px; display:${nameMail ? "block" : "none"};">${nameMail}</h2>
        <div style="text-align:center; display:${imgBanner}; margin:20px;">
          <img src="${banner}" alt="banner" style="width:100%;max-width:400px;border-radius:8px;"/>
        </div>
        <div style="text-align:center; display:${buttonVisible}; margin:20px;">
          <a href="${buttonRedirect || "#"}" style="background:#ff6f61;color:#fff;padding:12px 25px;border-radius:25px;text-decoration:none;">
            ${btnName}
          </a>
        </div>
        <div style="padding:20px; font-size:16px; color:#333;">${text}</div>
        <p style="padding:20px; font-size:14px; color:#555;">
          Best Regards,<br><b style="color:#007bff">${owner}</b>
        </p>
      </div>
    </body>
  </html>
  `;

  try {
    const results = [];
    for (const recipient of to) {
      const info = await transporter.sendMail({
        from: username,
        to: recipient,
        subject,
        html: emailHtml,
      });
      results.push({ recipient, messageId: info.messageId });
    }

    res.status(200).json({
      message: "Bulk email sent",
      sentCount: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send emails", error: error.message });
  }
};
