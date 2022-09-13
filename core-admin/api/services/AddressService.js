import AddressRepository from '../repositories/AddressRepository'

export default class AddressService {
    constructor() {
        this.repository = new AddressRepository()
    }

    getProvinces() {
        return this.repository.getProvinces()
    }

    getRegencies(province_id) {
        return this.repository.getRegencies(province_id)
    }

    getDistricts(regency_id) {
        return this.repository.getDistricts(regency_id)
    }

    getVillages(district_id) {
        return this.repository.getVillages(district_id)
    }
}