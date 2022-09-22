import TransactionService from '../../services/TransactionService'

const service = new TransactionService()

exports.list = async (req, res, next) => {
    const filter = {
        name: req.query.name || '',
        vehicle_brand: req.query.vehicle_brand || '',
        vehicle_type: req.query.vehicle_type || '',
        product_name: req.query.product_name || '',
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getTransactionCount(filter)
    const list = await service.getTransactionAll(filter, limit, offset)

    return res.jsonData({
        pagination: {
            total: count[0].total,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count[0].total / limit),
        },
        list: list
    })
}

exports.detail = async (req, res, next) => {
    const data = await service.getTransactionDetail(req.params.id)

    return res.jsonData(data)
}