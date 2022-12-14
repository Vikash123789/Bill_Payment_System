const mongoose = require('mongoose')


const isValidInputBody = function(object) {
    return Object.keys(object).length > 0
}


const isValidInputValue = function(value) {
    if (typeof(value) === 'undefined' || value === null) return false
    if (typeof(value) === 'string' && value.trim().length > 0) return true
    return false
}

const isValidOnlyCharacters = function(value) {
    return /^[A-Za-z]+$/.test(value)
}

const isValidAddress = function(value) {
    if (typeof(value) === "undefined" || value === null) return false;
    if (typeof(value) === "object" && Array.isArray(value) === false && Object.keys(value).length > 0) return true;
    return false;
};


const isValidPhone = function(phone) {
    const regexForMobile = /^[6-9]\d{9}$/;
    return regexForMobile.test(phone);
};

const isValidPassword = function(password) {
    const regexForPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    return regexForPass.test(password);
};

const isValidNumber = function(value) {
    if (typeof(value) === "undefined" || value === null) return false;
    if (typeof(value) === "string" && value.trim().length > 0 && Number(value) !== NaN) return true
    if (typeof(value) === "number") return true;
    return false;
};

const isValidPrice = function(price) {
    let regexForPrice = /^\d+(\.\d{1,2})?$/
    return regexForPrice.test(price)
};

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidImageType = function(value) {
    const regexForMimeTypes = /image\/png|image\/jpeg|image\/jpg/;
    return regexForMimeTypes.test(value)
}


module.exports = {
    isValidInputBody,
    isValidInputValue,
    isValidOnlyCharacters,
    isValidAddress,
    isValidPhone,
    isValidPassword,
    isValidNumber,
    isValidPrice,
    isValidObjectId,
    isValidImageType
}