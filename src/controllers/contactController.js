const EmailService = require("../services/emailService");
const axios = require("axios");

// Get all emails
const getEmails = async (req, res, next) => {
  try {
    const emails = await EmailService.getAllEmails(req);
    res.json(emails);
  } catch (err) {
    next(err);
  }
};

// Get single email by ID
const getEmail = async (req, res, next) => {
  try {
    const email = await EmailService.getEmailById(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    res.json(email);
  } catch (err) {
    next(err);
  }
};


// Create new email entries (single or bulk)
const createEmail = async (req, res, next) => {
  try {
    let data = req.body;

    // Support single object too
    if (!Array.isArray(data)) {
      data = [data];
    }

    const saved = [];
    const failed = [];

    // Loop through all emails
    for (const item of data) {
      try {
        const { shop_id, name, email, mobile_number } = item;

        // Validation
        if (!shop_id || !email || !mobile_number) {
          failed.push({
            ...item,
            error: "shop_id and email, Mobile Number are required",
          });
          continue; // skip and continue
        }

        // Try save
        const newEmail = await EmailService.createEmail({ shop_id, name, email, mobile_number });
        saved.push(newEmail);
      } catch (err) {
        failed.push({
          ...item,
          error: err.message || "Error saving email",
        });
        continue; // skip and continue
      }
    }

    // Response
    res.status(207).json({
      message: "Bulk insert completed with partial results",
      savedCount: saved.length,
      failedCount: failed.length,
      saved,
      failed,
    });
  } catch (err) {
    next(err);
  }
};


// Update email entry
const updateEmail = async (req, res, next) => {
  try {
    const updatedEmail = await EmailService.updateEmail(req.params.id, req.body);
    if (!updatedEmail) return res.status(404).json({ error: "Email not found" });
    res.json(updatedEmail);
  } catch (err) {
    next(err);
  }
};

// Delete email entry
const deleteEmail = async (req, res, next) => {
  try {
    await EmailService.deleteEmail(req.params.id);
    res.json({ message: "Email deleted" });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getEmails,
  getEmail,
  createEmail,
  updateEmail,
  deleteEmail,
  // checkSubscription,
  // createPriceing
};
