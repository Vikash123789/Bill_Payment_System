const userModel = require("../models/userModel");
const billModel = require("../models/billModels")
const validator = require("../utilities/validator")
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken")



const newCustomer = async (req, res) => {

    try {
        const requestBody = req.body;

        if (!validator.isValidInputBody(requestBody)) {
            return res.status(400).send({ status: false, message: "User data is required for registration" });
        }
        //using destructuring
        let { customerName, phoneNumber, password } = requestBody;

        // each key validation starts here

        if (!validator.isValidInputValue(customerName)) {
            return res.status(400).send({ status: false, message: "First name is required like : Vikash" });
        }

        if (!phoneNumber) {
            return res.status(400).send({ status: false, message: "Phone number is required" });
        }

        if (!validator.isValidPhone(phoneNumber)) {
            return res.status(400).send({
                status: false, message: "Please enter a valid phone number like : 9131351961",
            });
        }

        const phoneNumberAlready = await userModel.findOne({ phoneNumber });

        if (phoneNumberAlready) {
            return res
                .status(400)
                .send({ status: false, message: "phone number already exist" });
        }

        if (!validator.isValidInputValue(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({
                status: false, message: "Password should be of 8 to 15 characters and  must have 1 letter and 1 number",
            });
        }


        // password encryption
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);



        const finalData = {
            customerName: customerName.trim(),
            phoneNumber: phoneNumber, password,
            password: encryptedPassword
        }

        const createData = await userModel.create(finalData)

        return res.status(201).send({ status: true, message: createData })

    }
    catch (error) {
        return res.status(500).send({ message: error.message })
    }
}





const customerLogin = async (req, res) => {
    try {

        const phoneNumber = req.body.phoneNumber;
        const password = req.body.password

        if (!phoneNumber) {
            return res.status(400).send({ status: false, message: "Phone number is required" });
        }

        if (!validator.isValidPhone(phoneNumber)) {
            return res.status(400).send({
                status: false, message: "Please enter a valid phone number like : 9131351961",
            });
        }

        const phoneNumberExist = await userModel.findOne({ phoneNumber });

        if (!phoneNumberExist) {
            return res.status(400).send({ status: false, message: "phone number not exist" });
        }

        if (!validator.isValidInputValue(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({
                status: false, message: "Password should be of 8 to 15 characters and  must have 1 letter and 1 number",
            });
        }

        // comparing hashed password and login password
        const isPasswordMatching = await bcrypt.compare(password, phoneNumberExist.password);

        if (!isPasswordMatching) {
            return res.status(400).send({ status: false, message: "Incorrect password" });
        }

        // creating jsonweb token 

        const payload = { userId: phoneNumberExist._id };
        const expiry = { expiresIn: "24h" };
        const secretKey = "Secret Key";

        const token = jsonwebtoken.sign(payload, secretKey, expiry);

        // setting bearer token in response header
        res.header("Authorization", "Bearer " + token);

        const data = { userId: phoneNumberExist._id, token: token };

        return res.status(200).send({ status: true, message: "login successful", data: data });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


module.exports = {
 newCustomer,
 customerLogin
}