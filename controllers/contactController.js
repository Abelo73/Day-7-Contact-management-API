const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");
// @des Get all contacts
// @route GET /api/contacts
// @access public

const getAllContacts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ user_id: req.user.id })
    .skip(skip)
    .limit(limit);

  if (!contacts) {
    res.status(404);
    return new Error("Empty");
  }
  const total = await Contact.countDocuments();
  const totalPages = Math.ceil(total / limit);
  res.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
});

// @des create contacts
// @route POST /api/contacts
// @access public
const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json({ message: "Create contact", data: contact });
});

// @des Update contacts
// @route PUT /api/contacts/id
// @access public
const updateContact = asyncHandler(async (req, res) => {
  console.log(req.body);

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User Not have permission to update this contact");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json({
    message: `Updated contact with id ${req.params.id}`,
    contact: updatedContact,
  });
});
// @des delete contacts
// @route DELETE /api/contacts/id
// @access public

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User Not have permission to delete this contact");
  }

  const deletedContact = await Contact.findByIdAndDelete(req.params.id); // Directly delete the contact

  if (deletedContact) {
    res.status(200).json({
      message: `Contact removed with id ${req.params.id}`,
      contact: deletedContact,
    });
  } else {
    res.status(404).json({
      message: "Contact not found after deletion attempt",
    });
  }
});

// @des get single contacts
// @route GET /api/contacts/id
// @access public

const getSingleContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  console.log("Request: ", contact);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json({
    message: `Contact found with id ${req.params.id}, `,
    data: contact,
  });
});

module.exports = {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  getSingleContactById,
};
