const express = require("express");
const Joi = require("joi");
const {
  addContact,
  listContacts,
  removeContact,
  getContactById,
  updateContact,
} = require("../../models/contacts.models");

const router = express.Router();

const contactSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .required()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
});

router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "template message" });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ contact });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving the contact" });
  }
});

router.post("/", async (req, res) => {
  const validationResult = contactSchema.validate(req.body);

  if (validationResult.error) {
    const missingFields = validationResult.error.details.map(
      (detail) => detail.path[0]
    );
    return res
      .status(400)
      .send({ message: `missing required ${missingFields.join(", ")} field` });
  }

  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Error during add contact" });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error during delete contact" });
  }
});

router.put("/:contactId", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }

  try {
    const contact = await updateContact(req.params.contactId, req.body);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas aktualizacji kontaktu" });
  }
});
module.exports = router;
