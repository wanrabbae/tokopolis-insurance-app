import TransactionService from '../../services/TransactionService'

const service = new TransactionService()

exports.list = async (req, res, next) => {
    const filter = {
        id: req.query.id || '',
        name: req.query.name || '',
        vehicle_brand: req.query.vehicle_brand || '',
        vehicle_sub_model: req.query.vehicle_sub_model || '',
        vehicle_type: req.query.vehicle_type || '',
        product_name: req.query.product_name || '',
        start_period: req.query.start_period || null,
        end_period: req.query.end_period || null,
    }

    const current = Number(req.query.current) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (current - 1) * limit

    const count = await service.getTransactionCount(filter)
    const list = await service.getTransactionAll(filter, limit, offset)

    if (count.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

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
    if (data.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(data[0])
}