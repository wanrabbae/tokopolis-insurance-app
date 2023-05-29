const moment = require('moment')

const toMillion = (price) => price * 1000000
const toDecimal = (valueInPercent) => valueInPercent / 100
const toPercent = (valueInDecimal) => (valueInDecimal * 100).toFixed(2)

const comprehensive = (price, category, zone) => {
    const type1 = [[3.82, 3.26, 2.53], [2.67, 2.47, 2.69], [2.18, 2.08, 1.79],
    [1.2, 1.2, 1.14], [1.05, 1.05, 1.05]]
    const type2 = [2.42, 2.39, 2.23]

    const list = () => {
        if (category == 'A') { // Non bus non truck
            if (price <= toMillion(125)) {
                return type1[0]
            }
            else if (price > toMillion(125) && price <= toMillion(200)) {
                return type1[1]
            }
            else if (price > toMillion(200) && price <= toMillion(400)) {
                return type1[2]
            }
            else if (price > toMillion(400) && price <= toMillion(800)) {
                return type1[3]
            }
            else {
                return type1[4]
            }
        }

        return type2 // Bus, truck, pickup
    }

    return toDecimal(list()[zone - 1])
}

const tlo = (price, category, zone) => {
    const type1 = [[0.47, 0.65, 0.51], [0.63, 0.44, 0.44], [0.41, 0.38, 0.29],
    [0.25, 0.25, 0.23], [0.2, 0.2, 0.2]]
    const type2 = [0.88, 1.68, 0.81]

    const list = () => {
        if (category == 'A') { // Non bus non truck
            if (price <= toMillion(125)) {
                return type1[0]
            }
            else if (price > toMillion(125) && price <= toMillion(200)) {
                return type1[1]
            }
            else if (price > toMillion(200) && price <= toMillion(400)) {
                return type1[2]
            }
            else if (price > toMillion(400) && price <= toMillion(800)) {
                return type1[3]
            }
            else {
                return type1[4]
            }
        }

        return type2 // Bus, truck, pickup
    }

    return toDecimal(list()[zone - 1])
}

const loadingRate = (start_date, vehicle_year) => {
    const ratePerYear = toDecimal(5)
    const ageThreshold = 5 // 5 Year

    const startYear = moment(start_date).format('YYYY')
    const vehicleAge = Number(startYear - vehicle_year)

    if (vehicleAge <= ageThreshold) return 0

    return ratePerYear * (vehicleAge - ageThreshold)
}

const flood = (type, zone) => {
    const comprehensive = [0.075, 0.10, 0.075]
    const tlo = [0.05, 0.075, 0.05]

    if (type == 'comprehensive') {
        return toDecimal(comprehensive[zone - 1])
    }

    return toDecimal(tlo[zone - 1])
}

const earthQuake = (type, zone) => {
    const comprehensive = [0.12, 0.10, 0.075]
    const tlo = [0.085, 0.075, 0.05]

    if (type == 'comprehensive') {
        return toDecimal(comprehensive[zone - 1])
    }

    return toDecimal(tlo[zone - 1])
}

const srccTerorism = (type) => {
    if (type == 'comprehensive') {
        return toDecimal(0.05)
    }

    return toDecimal(0.035)
}

const tplRate = (price, vehicle_function) => {
    const privateVehicle = [1, 0.5, 0.25, 0]
    const commercialVehicle = [1.5, 0.75, 0.375, 0]
    const jumpValues = [25, 25, 50, 0] // Based on max value - min value condition

    const rate = (index) => {
        if (vehicle_function == 'private') {
            return privateVehicle[index]
        }

        return commercialVehicle[index]
    }

    const priceTotal = price
    var rateIndex = 0
    var rateTotal = 0

    const calculatePrice = (value, jumpValue) => {
        if (value > toMillion(jumpValue)) {
            return toMillion(jumpValue)
        }

        return value
    }

    while (price > 0) {
        const maxPrice = calculatePrice(price, jumpValues[rateIndex])// 0.0625
        const currentRate = rate(rateIndex)

        rateTotal += (maxPrice / priceTotal) * toDecimal(currentRate) // (x / 80000000) * (0.125/100) = 12500
        price -= toMillion(25)

        if (rateIndex < 3) rateIndex++
    }

    return rateTotal
}

const paDriver = (price) => {
    return toDecimal(0.50)
}

const paPassenger = (price, count = 1) => {
    return toDecimal(0.10) * count
}

module.exports = {
    toMillion, toDecimal, toPercent,
    comprehensive, tlo, loadingRate,
    flood, earthQuake, srccTerorism,
    tplRate, paDriver, paPassenger
}