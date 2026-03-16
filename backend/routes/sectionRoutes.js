const { Router } = require("express");
const { body } = require("express-validator");
const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = Router();

router.get("/", getSections);
router.post(
  "/",
  auth,
  admin,
  [body("name").trim().notEmpty().withMessage("Name is required.")],
  createSection
);
router.patch("/:id", auth, admin, updateSection);
router.delete("/:id", auth, admin, deleteSection);

module.exports = router;
