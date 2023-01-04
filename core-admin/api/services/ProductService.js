const fs = require('fs')

import ProductRepository from '../repositories/ProductRepository'

const { toMillion, toDecimal, comprehensive, tlo, flood,
    earthQuake, srccTerorism, tplRate,
    paDriver, paPassenger } = require('../utilities/calculation')
const { uploadHandler, stringTag } = require('../utilities/functions')

const nuxtFolder = process.env.NUXT_STATIC_DIR

export default class VehicleService {
    constructor() {
        this.repository = new ProductRepository()
    }

    productNames() {
        return this.repository.productNames()
    }

    async getProductAll(filter, limit, offset) {
        return await this.repository.getProductAll(filter, limit, offset)
    }

    async getProductList(payload, limit, offset, product_price) {
        const data = await this.repository.getProductList(payload, limit, offset)
        data.map(data => data.dataValues.price = product_price)

        return data
    }

    async getProductsComparation(ids, product_price) {
        const products = []
        const types = ['era', 'ambulance', 'call_center', 'tow',
            'replace_vehicle', 'taxi_fare', 'nfo',
            'repair_warranty', 'mobile_app', 'to_workshop', 'other']

        const list = await this.repository.getProductsComparation(ids)

        if (list.length != ids.length) {
            return []
        }

        for (const data of list) {
            const item = data.get({ plain: true })

            item.price = product_price
            item.feature = {}

            types.forEach(it => item.feature[it] = { status: false,
                description: null })
            item.features.forEach(el => item.feature[el.type] = { status: true,
                description: el.short_description })

            delete item.features

            products.push(item)
        }

        return products
    }

    getCountByVehicle(payload) {
        return this.repository.getCountByVehicle(payload)
    }

    async getCountByQuery(filter) {
        return this.repository.getCountByQuery(filter)
    }

    getProduct(id) {
        return this.repository.getProduct(id)
    }

    async getExpansionList(vehicle, product_id) {
        const productExpansions = await this.repository.getExpansionList(product_id)
        const defaultExpansions = [
            {
                name: "flood",
                label: "Angin Topan, Banjir, Badai, Angin Ribut, dan Tanah Longsor",
                premium: {
                    rate: flood(vehicle.protection, vehicle.zone),
                    price: vehicle.price * flood(vehicle.protection, vehicle.zone)
                }
            },
            {
                name: "earthquake",
                label: "Gempa Bumi, Tsunami, dan Letusan Gunung Berapi",
                premium: {
                    rate: earthQuake(vehicle.protection, vehicle.zone),
                    price: vehicle.price * earthQuake(vehicle.protection, vehicle.zone)
                }
            },
            {
                name: "srcc",
                label: "Huru-hara dan Kerusuhan",
                premium: {
                    rate: srccTerorism(vehicle.protection),
                    price: vehicle.price * srccTerorism(vehicle.protection)
                }
            },
            {
                name: "terorism",
                label: "Terorisme dan Sabotase",
                premium: {
                    rate: srccTerorism(vehicle.protection),
                    price: vehicle.price * srccTerorism(vehicle.protection)
                }
            },
            {
                name: "tpl",
                label: "Tanggung Jawab Hukum terhadap Pihak Ketiga",
                premiums: (() => {
                    const premiums = []

                    for (let value = 5; value <= 100; value+=5) {
                        premiums.push({
                            value: toMillion(value),
                            rate: tplRate(toMillion(value), vehicle.use),
                            price: toMillion(value) * tplRate(toMillion(value), vehicle.use),
                        })
                    }

                    return premiums
                })()
            },
            {
                name: "pad",
                label: "Kecelakaan Diri untuk Pengemudi",
                premiums: (() => {
                    const premiums = []

                    for (let value = 5; value <= 50; value+=5) {
                        premiums.push({
                            value: toMillion(value),
                            rate: paDriver(toMillion(value)),
                            price: toMillion(value) * paDriver(toMillion(value)),
                        })
                    }

                    return premiums
                })()
            },
            {
                name: "pap",
                label: "Kecelakaan Diri untuk Penumpang",
                premiums: (() => {
                    const premiums = []

                    for (let value = 5; value <= 50; value+=5) {
                        premiums.push({
                            value: toMillion(value),
                            rate: paPassenger(toMillion(value)),
                            price: toMillion(value) * paPassenger(toMillion(value)),
                        })
                    }

                    return premiums
                })(),
                max_passenger: vehicle.capacity - 1
            },
        ]

        for (const item of productExpansions) {
            defaultExpansions.push({
                name: item.name,
                label: item.label,
                premium: {
                    rate: toDecimal(item.rate),
                    price: vehicle.price * toDecimal(item.rate)
                },
            })
        }

        return defaultExpansions
    }

    getExpansionJson(payloads) {
        const expansions = []

        for (const item of payloads != null ? payloads : []) {
            const arr = item.split(',')
            const data = { code: arr[0] }

            if (arr[1] != null) {
                data.limit = Number(arr[1])
            }

            if (arr[2] != null) {
                data.count = Number(arr[2])
            }

            expansions.push(data)
        }

        return expansions
    }

    getExpansionWithPrice(dataset, json) {
        for (const [i, item] of json.entries()) {
            for (const data of dataset) {
                if (item.code != data.name) continue

                json[i]['label'] = data.label

                if ('premium' in data) {
                    json[i]['rate'] = data.premium.rate
                    json[i]['price'] = data.premium.price
                }

                if ('premiums' in data) {
                    const index = (item.limit / 5) - 1

                    json[i]['value'] = data.premiums[index].value
                    json[i]['rate'] = data.premiums[index].rate
                    json[i]['price'] = data.premiums[index].price

                    if ('count' in item) {
                        json[i]['count'] = item.count
                        json[i]['price'] *= item.count
                    }
                }
            }
        }

        return json
    }

    getExpansionTotalPrice(expansions) {
        return expansions.reduce((prev, current) => prev + current.price, 0)
    }

    getPremiumPrice(vehicle_price, category, zone, protection) {
        if (protection == "comprehensive") {
            return comprehensive(vehicle_price, category, zone)
        }

        return tlo(vehicle_price, category, zone)
    }

    createProduct(payload, files) {
        Object.keys(files).forEach(key => {
            const image = uploadHandler(files[key][0].path, 'product')
            payload[key] = image.clearPath
        })

        return this.repository.createProduct(payload)
    }

    updateProduct(product, payload, files) {
        let photos = []

        Object.keys(files).forEach(key => {
            photos.push(`${nuxtFolder}/${product[key]}`)

            const image = uploadHandler(files[key][0].path, 'product')
            payload[key] = image.clearPath
        })

        for (const item of photos) {
            if (fs.existsSync(item)) {
                fs.unlinkSync(item, { recursive: true })
            }
        }

        return this.repository.updateProduct(product.id, payload)
    }

    deleteProduct(id) {
        return this.repository.deleteProduct(id)
    }

    createFeature(payload) {
        return this.repository.createFeature(payload)
    }

    updateFeature(id, payload) {
        return this.repository.updateFeature(id, payload)
    }

    deleteFeature(id) {
        return this.repository.deleteFeature(id)
    }

    createExpansion(payload) {
        payload.name = stringTag(payload.label)

        return this.repository.createExpansion(payload)
    }

    updateExpansion(id, payload) {
        payload.name = stringTag(payload.label)

        return this.repository.updateExpansion(id, payload)
    }

    deleteExpansion(id) {
        return this.repository.deleteExpansion(id)
    }
}