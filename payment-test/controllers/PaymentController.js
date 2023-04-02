const axios = require('axios')

exports.simulateVaPay = async (req, res) => {
    console.log(req.body);
    const vaNumber = req.body.va_number

    try {
        const sendRequest = await axios.post("http://localhost:3001/api/simulate/pay", {
            va_number: vaNumber,
        }, {})
        console.log(sendRequest);

        if (sendRequest) {
            return res.status(200).json(sendRequest.data)
        }
    } catch (error) {
        return res.status(400).json(error.response?.data)
    }
}