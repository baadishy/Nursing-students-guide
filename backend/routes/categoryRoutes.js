const { Router } = require("express");
const { body } = require("express-validator");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = Router();

router.get("/:sectionId?", getCategories);
router.post(
  "/",
  auth,
  admin,
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("sectionId").notEmpty().withMessage("sectionId is required."),
  ],
  createCategory
);
router.patch("/:id", auth, admin, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);

module.exports = router;
