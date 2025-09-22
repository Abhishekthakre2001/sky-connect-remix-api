const EmailModel = require("../models/emailModel");

// Get all emails
async function getAllEmails(req) {
  return await EmailModel.getAll(req);
}

// Get email by ID
async function getEmailById(id) {
  return await EmailModel.getById(id);
}

// Create new email
async function createEmail(data) {
  console.log("data in service:", data);
  if (!data.shop_id || !data.email) {
    throw new Error("shop_id and email are required");
  }
  return await EmailModel.create(data);
}

// Update email
async function updateEmail(id, data) {
  return await EmailModel.update(id, data);
}

// Delete email
async function deleteEmail(id) {
  return await EmailModel.delete(id);
}

module.exports = {
  getAllEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
};
