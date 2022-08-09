const billModel = require("../models/billModels");
const billController = require("../models/billModels")
const userModel = require("../models/userModel")
const AWS = require("../utilities/aws");
const validator = require('../utilities/validator')
const moment = require('moment')




const createBill = async (req, res) => {
    try {

        const requestBody = { ...req.body };
        const userId = req.params.userId;
        const attachment = req.files;
        const decodedToken = req.decodedToken;


        //Object Destructuring 
        let { meterNumber, units, amount, lastDate } = requestBody

        if (!validator.isValidInputValue(userId)) {
            return res.status(400).send({ status: false, message: "UserId are required " });
        }
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter a valid userId " });
        }

        if (!validator.isValidInputValue(meterNumber)) {
            return res.status(400).send({ status: false, message: "meterNumber are required " });
        }


        if (!validator.isValidInputValue(units)) {
            return res.status(400).send({ status: false, message: "units are required " });
        }

        if (!validator.isValidInputValue(amount)) {
            return res.status(400).send({ status: false, message: "meterNumber are required " });
        }
        if (!validator.isValidInputValue(lastDate)) {
            return res.status(400).send({ status: false, message: "meterNumber are required " });
        }
        if (!attachment) {
            return res.status(400).send({ status: false, message: "BillAttachment are required " });

        }
        if (typeof (attachment) !== undefined) {
            if (attachment && attachment.length > 0) {
                if (!validator.isValidImageType(attachment[0].mimetype)) {
                    return res.status(400).send({ status: false, message: "Only images can be uploaded (jpeg/jpg/png)" });
                }
            }
        }


        if (decodedToken.userId != userId) {
            return res.status(403).send({ status: false, message: "UnAuthorized Customer" });

        }

        // const billAttachment = await AWS.uploadFile(attachment[0]);
        let calculatedAmount = 0;
        amount = JSON.parse(amount)
        if (units <= 50) {
            calculatedAmount = amount + units * 3.50
        } else if (units <= 150) {
            calculatedAmount = amount + units * 4
        } else {
            calculatedAmount = amount + units * 6.50
        }


        let paymentStatus = ""
        let date = moment().format('YYYY-MM-DD')

        if (lastDate >= date) {
            paymentStatus = 'Pending'
        } else {
            paymentStatus = 'Unpaid'
        }

        let userData = await userModel.findById({ _id: userId }).select({ _id: 0, customerName: 1 })

        let finalBillData = {
            customerName: userData.customerName,
            meterNumber: meterNumber,
            units: units,
            amount: calculatedAmount,
            lastDate: lastDate,
            status: paymentStatus
        }
        const billData = await billModel.create(finalBillData)
        return res.status(200).send({ status: true, billDetail: billData });


    } catch (error) {
        return res.status(500).send({ message: error.message });

    }
}


let paymentUpdate = async (req, res) => {
    try {

        const paymentStatus = req.body.status;
        const userId = req.params.userId

        if (!validator.isValidInputValue(paymentStatus)) {
            return res.status(400).send({ status: false, message: "paymentStatus are required " });
        }
        let checkAlreadyPayOrNot = await billModel.findById({ _id: userId })
        if (checkAlreadyPayOrNot.status == 'Paid') {
            return res.status(400).send({ status: false, message: "Already Payment Done " });

        } else {
            let updateStatus = await billModel.findByIdAndUpdate({ _id: req.params.userId }, { status: "Paid" }, { new: true })

            return res.status(200).send({ status: true, message: "Bill-Paid SuccessFully", updateStatus: updateStatus });
        }
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

let getAllBill = async (req, res) => {
    try {

        let allBillList = await billModel.find()

        return res.status(200).send({ status: true, AllBills: allBillList });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

module.exports = {
    createBill,
    paymentUpdate,
    getAllBill
}
