const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");

const billController = require("../controllers/billController");
const userController = require("../controllers/userController");


router.post("/customerRegister", userController.newCustomer);
router.post("/customerLogin", userController.customerLogin);
router.post("/billCreate/:userId",auth.authentication ,billController.createBill)
router.post("/paymentUpdate/:userId", auth.authentication ,billController.paymentUpdate)
router.get("/getBill",billController.getAllBill)








module.exports = router;