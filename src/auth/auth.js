const jsonwebtoken = require("jsonwebtoken")
const validator = require('../utilities/validator')

//********************************AUTHENTICATION********************************** */

const authentication = async function (req, res, next) {

    const bearerToken = req.headers["authorization"]

    if (!validator.isValidInputValue(bearerToken)) {
        return res.status(401).send({ status: false, message: "token is missing" })
    }
    const token = bearerToken.split(" ")[1]

    const secretKey = 'Secret Key'

    if (!token) {
        return res.status(401).send({ status: false, message: "authentication failed : Token not found" })
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, secretKey, { ignoreExpiration: true })

        if (Date.now() > decodedToken.exp * 1000) {
            return res.status(401).send({ status: false, message: "Authentication failed : Session expired" })
        }

        req.decodedToken = decodedToken

        next()

    } catch {
        return res.status(401).send({ status: false, message: "Authentication failed" })
    }
}


module.exports.authentication = authentication