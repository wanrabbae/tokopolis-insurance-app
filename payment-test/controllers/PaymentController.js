const axios = require('axios')

exports.simulateVaPay = async (req, res) => {
    const vaNumber = req.body.va_number

    try {
        const sendRequest = await axios.post(process.env.API_SERVER_URL + "/api/simulate/pay", {
            va_number: vaNumber,
        }, {})

        if (sendRequest) {
            return res.status(200).json(sendRequest.data)
        }
    } catch (error) {
        return res.status(400).json(error.response?.data)
    }
}