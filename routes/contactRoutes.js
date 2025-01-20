const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken");

const {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  getSingleContactById,
} = require("../controllers/contactController");

router.use(validateToken);

router.route("/").get(getAllContacts);
router.route("/").post(createContact);
router.route("/:id").get(getSingleContactById);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;
