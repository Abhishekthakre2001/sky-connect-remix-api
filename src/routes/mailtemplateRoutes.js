const express = require("express");
const EmailtemplateController = require("../controllers/mailtemplateController");

const router = express.Router();

router.get("/", EmailtemplateController.getallEmailTemplates);
router.get("/:id", EmailtemplateController.getEmailTemplate);
router.post("/", EmailtemplateController.createEmailTemplate);
router.put("/:id", EmailtemplateController.updateEmailTemplate);
router.delete("/:id", EmailtemplateController.deleteEmailTemplate);

module.exports = router;
