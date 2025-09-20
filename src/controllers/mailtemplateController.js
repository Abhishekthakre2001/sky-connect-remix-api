const EmailTemplate = require("../models/emailTemplateModel");

async function getallEmailTemplates(req, res, next) {
  console.log("in controller");
  try {
    const [rows] = await EmailTemplate.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getEmailTemplate(req, res, next) {
  try {
    const [rows] = await EmailTemplate.getById(req.params.id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Email template not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createEmailTemplate(req, res, next) {
  try {
    const data = req.body;

    if (!data.Name || !data.Subject) {
      return res.status(400).json({ error: "Name and Subject are required" });
    }

    const [result] = await EmailTemplate.create(data);
    res.status(201).json({
      message: "Email template created",
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
}

async function updateEmailTemplate(req, res, next) {
  try {
    const data = req.body;
    const [result] = await EmailTemplate.update(req.params.id, data);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Email template not found" });
    }

    res.json({ message: "Email template updated" });
  } catch (err) {
    next(err);
  }
}

async function deleteEmailTemplate(req, res, next) {
  try {
    const [result] = await EmailTemplate.remove(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Email template not found" });
    }

    res.json({ message: "Email template deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getallEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
};
