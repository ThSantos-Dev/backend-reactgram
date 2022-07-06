const express = require("express");
const router = express.Router();

// Chamando as funções da controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../contollers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");

const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

// Rotas
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

router.get("/profile", authGuard, getCurrentUser);
router.get("/:id", getUserById);

router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

module.exports = router;
