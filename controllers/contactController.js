const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");
// @des Get all contacts
// @route GET /api/contacts
// @access public

const getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Ensure page is a number
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100); // Cap limit to 100
  const skip = (page - 1) * limit;

  // Fetch contacts for the user
  const total = await Contact.countDocuments({ user_id: req.user.id }); // Get total contacts count
  const contacts = await Contact.find({ user_id: req.user.id })
    .skip(skip)
    .limit(limit);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Response for empty results
  if (!contacts.length) {
    return res.status(200).json({
      message: "No contacts found",
      contacts: [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }

  // Success response
  res.status(200).json({
    message: "Contacts fetched successfully",
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
  const { name, email, phone } = req.body;

  // Ensure required fields are present
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // Validate `user.id`
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User ID is missing in the token");
  }

  // Create the contact
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id, // Correct field
  });

  res
    .status(201)
    .json({ message: "Contact created successfully", data: contact });
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
