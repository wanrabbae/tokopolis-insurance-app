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

    async getProductAll(query, limit, offset) {
        if (query == null) {
            return await this.repository.getProductAll(limit, offset)
        }

        return await this.repository.getProductAllWithFilter(query, limit, offset)
    }

    async getProductList(protection, limit, offset, product_price) {
        const data = await this.repository.getProductList(protection, limit, offset)
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

    getCountByProtection(protection) {
        return this.repository.getCountByProtection(protection)
    }

    async getCountByQuery(query) {
        if (query == null) {
            return await this.repository.getCountAll()
        }

        return this.repository.getCountByQuery(query)
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
                premiums: [
                    {
                        value: toMillion(5),
                        rate: tplRate(toMillion(5), vehicle.use),
                        price: toMillion(5) * tplRate(toMillion(5), vehicle.use),
                    },
                    {
                        value: toMillion(10),
                        rate: tplRate(toMillion(10), vehicle.use),
                        price: toMillion(10) * tplRate(toMillion(10), vehicle.use),
                    },
                    {
                        value: toMillion(15),
                        rate: tplRate(toMillion(15), vehicle.use),
                        price: toMillion(15) * tplRate(toMillion(15), vehicle.use),
                    },
                    {
                        value: toMillion(20),
                        rate: tplRate(toMillion(20), vehicle.use),
                        price: toMillion(20) * tplRate(toMillion(20), vehicle.use),
                    },
                ]
            },
            {
                name: "pad",
                label: "Kecelakaan Diri untuk Pengemudi",
                premiums: [
                    {
                        value: toMillion(5),
                        rate: paDriver(toMillion(5)),
                        price: toMillion(5) * paDriver(toMillion(5)),
                    },
                    {
                        value: toMillion(10),
                        rate: paDriver(toMillion(10)),
                        price: toMillion(10) * paDriver(toMillion(10)),
                    },
                    {
                        value: toMillion(15),
                        rate: paDriver(toMillion(15)),
                        price: toMillion(15) * paDriver(toMillion(15)),
                    },
                    {
                        value: toMillion(20),
                        rate: paDriver(toMillion(20)),
                        price: toMillion(20) * paDriver(toMillion(20)),
                    },
                ]
            },
            {
                name: "pap",
                label: "Kecelakaan Diri untuk Penumpang",
                premiums: [
                    {
                        value: toMillion(5),
                        rate: paPassenger(toMillion(5)),
                        price: toMillion(5) * paPassenger(toMillion(5)),
                    },
                    {
                        value: toMillion(10),
                        rate: paPassenger(toMillion(10)),
                        price: toMillion(10) * paPassenger(toMillion(10)),
                    },
                    {
                        value: toMillion(15),
                        rate: paPassenger(toMillion(15)),
                        price: toMillion(15) * paPassenger(toMillion(15)),
                    },
                    {
                        value: toMillion(20),
                        rate: paPassenger(toMillion(20)),
                        price: toMillion(20) * paPassenger(toMillion(20)),
                    },
                ],
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