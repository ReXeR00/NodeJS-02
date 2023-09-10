const express = require("express");
const Joi = require("joi");
const { addContact } = require("../../models/contacts.models");

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
  res.json({ message: "template message" });
});

router.get("/:contactId", async (req, res) => {
  res.json({ message: "template message" });
});

router.post("/", async (req, res) => {
  const validationResult = contactSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  const newContact = await addContact(req.body);
  res.json(newContact);
});

router.delete("/:contactId", async (req, res) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res) => {
  const validationResult = contactSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }
  res.json({ message: "template message" });
});

module.exports = router;
