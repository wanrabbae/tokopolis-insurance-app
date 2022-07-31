<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">
            
            <CommissionStats 
                :commission="5000000" 
                :product-sold="3" 
                :downline="5"
                class="mb-4"
            />

            <div class="d-flex justify-content-between align-items-center mb-3">

                <span class="fs-5 fs-md-4 fw-bold">Riwayat</span>

                <b-form-select v-model="selectedDateRange" class="w-auto" :options="dateRangeOptions"></b-form-select>
            </div>

            <b-table-simple class="commission-history" responsive>
                    
                <b-tr class="border-bottom">
                    
                    <b-th class="col-2 text-center align-middle">Tanggal</b-th>
                    
                    <b-th class="col-6 text-center align-middle">Keterangan</b-th>
                    
                    <b-th class="col-2 text-center align-middle">Jumlah</b-th>

                    <b-th class="col-2 text-center align-middle">Status</b-th>

                </b-tr>

                <b-tr v-if="!history" class="border-bottom" style="background-color: #efedfa">
                    
                    <b-td class="col-12 text-center align-middle" colspan="4">

                        Data Kosong

                    </b-td>

                </b-tr>

                <b-tr v-for="(historyItem, i) in history" v-else :key="i" class="border-bottom" style="background-color: #efedfa">
                    
                    <b-td class="col-2 text-center align-middle">{{ $dayjs(historyItem.date).format('DD-MM-YYYY') }}</b-td>
                    
                    <b-td class="col-6 text-center align-middle">

                        <div class="d-flex align-items-center">

                            <span 
                                class="d-inline-flex justify-content-center align-items-center rounded-circle mr-3 p-2" 
                                style="flex: 0 0 36px" 
                                :style="{ backgroundColor: type[historyItem.type].iconBgColor }"
                            >
                                
                                <b-img :src="type[historyItem.type].icon"/>
                            
                            </span>
                            
                            {{ type[historyItem.type].description }}

                        </div>

                    </b-td>
                    
                    <b-td class="col-2 text-center align-middle">{{ formatPrice(historyItem.value) }}</b-td>

                    <b-td class="col-2 text-center align-middle"><span :class="'text-' + status[historyItem.status].color">{{ status[historyItem.status].text }}</span></b-td>

                </b-tr>

            </b-table-simple>
        
        </div> <!-- container ends -->

    </div>

</template>

<script>
import CommissionStats from '../../components/CommissionStats'

export default {
    components: {
        CommissionStats
    },
    middleware: 'auth',
    data() {
        return {
            history: [
                {
                    date: '2022-07-31 04:23:56',
                    type: 'withdraw',
                    status: 'pending',
                    value: 1000000
                },
                {
                    date: '2022-07-31 04:23:56',
                    type: 'receive',
                    status: 'success',
                    value: 1000000
                },
            ],
            type: {
                withdraw: {
                    iconBgColor: '#F56060',
                    icon: '/svg/com-withdraw.svg',
                    description: "Penarikan Komisi",
                },
                receive: {
                    iconBgColor: '#24ABE8',
                    icon: '/svg/com-receive.svg',
                    description: "Komisi Diterima",
                }
            },
            status: {
                failed: {
                    text: 'Gagal',
                    color: 'alert'
                },
                pending: {
                    text: 'Pending',
                    color: 'warning'
                },
                success: {
                    text: 'Sukses',
                    color: 'success'
                }
            },
            selectedDateRange: 'last-30-days',
            dateRangeOptions: [
                { value: 'last-30-days', text: '30 Hari Terakhir' },
                { value: 'last-7-days', text: '7 Hari Terakhir' }
            ]
        }
    },
    head() {
        return {
            title: 'Komisi - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    }
}
</script>