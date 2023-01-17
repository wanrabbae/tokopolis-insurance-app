<template>

    <div>

        <div class="card border mb-4">

            <div class="row no-gutters">

                <div class="col-12 p-3 p-md-4 border-bottom">
<<<<<<< HEAD
                
=======

>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
                    <div class="d-flex align-items-center mb-2">

                        <div class="d-flex align-items-center flex-grow-1 fs-5 fs-md-4 fw-bold">

                            <span class="mr-2">
<<<<<<< HEAD
                                
                                <nuxt-img 
                                    height="36"
                                    preset="default"
                                    src="/svg/coins.svg" 
                                />

                            </span>
                            
                            Komisi
                            
                            <small 
                                v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Komisi di sini'" 
                                class="ml-1 pr-2 align-top text-primary opacity-75"
                            >
                                <fa icon="circle-info"/>
                            </small>
                        
                        </div>

                        <BaseButton @click="onWithdraw">Penarikan</BaseButton>
=======

                                <nuxt-img height="36" preset="default" src="/svg/coins.svg" />

                            </span>

                            Komisi

                            <small v-b-tooltip.hover.right.v-dark="'Jumlah akumulasi komisi yang tersedia'"
                                class="ml-1 pr-2 align-top text-primary opacity-75">
                                <fa icon="circle-info" />
                            </small>

                        </div>

                        <div v-if="bank.verified">
                            <BaseButton @click="onWithdraw">Penarikan</BaseButton>
                        </div>
                        <div v-else v-b-tooltip.hover.top.v-dark="'Data Rekening Bank belum diverifikasi'">
                            <BaseButton disabled>Penarikan</BaseButton>
                        </div>
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                    </div>

                    <div class="d-block">

                        <span class="fs-4 fs-md-2 fw-bold">{{ formatPrice(commission) }}</span>

                    </div>
<<<<<<< HEAD
            
                </div>

                <div class="col-6 border-right p-3 p-md-4">
                    
                    <div class="d-flex align-items-center fs-5 fs-md-4 fw-bold mb-2">
                        
                        <span class="mr-2">
                            
                            <nuxt-img 
                                height="36"
                                preset="default"
                                src="/img/shield-checkmark.png" 
                            />
=======

                </div>

                <div class="col-6 border-right p-3 p-md-4">

                    <div class="d-flex align-items-center fs-5 fs-md-4 fw-bold mb-2">

                        <span class="mr-2">

                            <nuxt-img height="36" preset="default" src="/img/shield-checkmark.png" />
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                        </span>

                        Polis Terjual
<<<<<<< HEAD
                        
                        <small 
                            v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Polis Terjual di sini'" 
                            class="ml-1 pr-2 align-top text-primary opacity-75"
                        >
                            <fa icon="circle-info"/>
=======

                        <small v-b-tooltip.hover.right.v-dark="'Akumulasi Transaksi Polis yang terbayar'"
                            class="ml-1 pr-2 align-top text-primary opacity-75">
                            <fa icon="circle-info" />
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
                        </small>

                    </div>

                    <div class="d-block">

                        <span class="fs-4 fs-md-2 fw-bold">{{ productSold }}</span>

                    </div>

                </div>

                <div class="col-6 p-3 p-md-4">
<<<<<<< HEAD
                    
                    <div class="d-flex align-items-center fs-5 fs-md-4 fw-bold mb-2">
                        
                        <span class="mr-2">
                            
                            <nuxt-img 
                                height="36"
                                preset="default"
                                src="/svg/stripes.svg" 
                            />
=======

                    <div class="d-flex align-items-center fs-5 fs-md-4 fw-bold mb-2">

                        <span class="mr-2">

                            <nuxt-img height="36" preset="default" src="/svg/stripes.svg" />
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                        </span>

                        GWP
<<<<<<< HEAD
                        
                        <small 
                            v-b-tooltip.hover.right.v-dark="'Masukkan deskripsi Gross Written Premium (GWP) di sini'" 
                            class="ml-1 pr-2 align-top text-primary opacity-75"
                        >
                            <fa icon="circle-info"/>
                        </small>                  
=======

                        <small
                            v-b-tooltip.hover.right.v-dark="'Jumlah akumulasi premi Gross atas transaksi polis yang terbayar'"
                            class="ml-1 pr-2 align-top text-primary opacity-75">
                            <fa icon="circle-info" />
                        </small>
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                    </div>

                    <div class="d-block">

                        <span class="fs-4 fs-md-2 fw-bold">{{ gwp }}</span>

                    </div>

                </div>

            </div>

        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">

            <span class="fs-5 fs-md-4 fw-bold">Riwayat</span>

            <b-form-select v-model="selectedDateRange" class="w-auto" :options="dateRangeOptions"></b-form-select>

        </div>

        <b-table-simple class="table-history mb-0" responsive>

            <b-tr class="border-bottom">

                <b-th class="col-2 text-center align-middle">Tanggal</b-th>

                <b-th class="col-6 text-center align-middle">Keterangan</b-th>

                <b-th class="col-2 text-center align-middle">Jumlah</b-th>

                <b-th class="col-2 text-center align-middle">Status</b-th>

            </b-tr>

<<<<<<< HEAD
            <b-tr v-if="!history" class="border-bottom" style="background-color: #efedfa">
=======
            <b-tr v-if="history.length == 0" class="border-bottom" style="background-color: #efedfa">
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                <b-td class="col-12 text-center align-middle" colspan="4">

                    Data Kosong

                </b-td>

            </b-tr>

<<<<<<< HEAD
            <b-tr v-for="(historyItem, i) in history" v-else :key="i" class="border-bottom" style="background-color: #efedfa">

                <b-td class="col-2 text-center align-middle">{{ $dayjs(historyItem.date).format('DD-MM-YYYY') }}</b-td>

                <b-td class="col-6 text-center align-middle">

                    <div class="d-flex align-items-center">

                        <span
                            class="d-inline-flex justify-content-center align-items-center rounded-circle mr-3 p-2"
                            style="flex: 0 0 36px; width:36px; height:36px"
                            :style="{ backgroundColor: type[historyItem.type].iconBgColor }"
                        >

                            <nuxt-img 
                                preset="default"
                                :src="type[historyItem.type].icon"
                                sizes="lg:32px"
                            />
=======
            <b-tr v-for="(historyItem, i) in history" v-else :key="i" class="border-bottom"
                style="background-color: #efedfa">

                <b-td class="col-2 text-center align-middle">{{ $dayjs(historyItem.date).format('DD MMM YYYY') }}</b-td>

                <b-td class="col-6 text-center align-middle">

                    <div class="d-flex justify-content-center align-items-center">

                        <span class="d-inline-flex justify-content-center align-items-center rounded-circle mr-2 p-2"
                            style="flex: 0 0 36px; width:36px; height:36px"
                            :style="{ backgroundColor: type[historyItem.type].iconBgColor }">

                            <nuxt-img preset="default" :src="type[historyItem.type].icon" sizes="lg:32px" />
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

                        </span>

                        {{ type[historyItem.type].description }}

                    </div>

                </b-td>

                <b-td class="col-2 text-center align-middle">{{ formatPrice(historyItem.value) }}</b-td>

<<<<<<< HEAD
                <b-td class="col-2 text-center align-middle"><span :class="'text-' + status[historyItem.status].color">{{ status[historyItem.status].text }}</span></b-td>
=======
                <b-td class="col-2 text-center align-middle"><span
                        :class="'text-' + status[historyItem.status].color">{{
                            status[historyItem.status].text
                        }}</span></b-td>
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

            </b-tr>

        </b-table-simple>

        <b-pagination v-if="history.length" v-model="currentPage"
            class="mt-4"
            v-bind="paginationOptions"
            @page-click="onPageClick"
        />

<<<<<<< HEAD
        <PenarikanKomisiModal 
            id="modal-penarikan-komisi"
        />
=======
        <PenarikanKomisiModal id="modal-penarikan-komisi" :fields="commissionData" @submit="onSubmit" />
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

    </div>

</template>

<script>

import PenarikanKomisiModal from '../../components/modals/PenarikanKomisiModal.vue'

export default {
    components: {
        PenarikanKomisiModal
<<<<<<< HEAD
    },  
=======
    },
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
    layout: 'userarea',
    data() {
        return {
            title: 'Komisi',
            commission: 0,
            productSold: 0,
            gwp: 0,
            history: [
<<<<<<< HEAD
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
=======
                // {
                //     date: '2022-07-31 04:23:56',
                //     type: 'withdraw',
                //     status: 'pending',
                //     value: 1000000
                // },
                // {
                //     date: '2022-07-31 04:23:56',
                //     type: 'receive',
                //     status: 'success',
                //     value: 1000000
                // },
            ],
            currentPage: 1,
            paginationOptions: {
                align: "center",
                disabled: !this.isLoggedIn,
                limit: 3,
                perPage: 6,
                totalSearchResult: 10,
            },
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
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
<<<<<<< HEAD
            ],            
            currentPage: 1,
            paginationOptions: {
                align: "center",
                disabled: !this.isLoggedIn,
                limit: 3,
                perPage: 6,
                totalSearchResult: 10,
            },
=======
            ],
            bank: {
                name: null,
                accountNumber: null,
                accountName: null,
                verified: false
            },
            bankAlias: {
                'bca': 'BCA',
                'bni': 'BNI',
                'mandiri': 'Mandiri',
                'bri': 'BRI',
                'btn': 'BTN',
                'cmb': 'CIMB Niaga',
            }
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
<<<<<<< HEAD
=======
    computed: {
        commissionData() {
            return {
                value: this.commission,
                bank: this.bankAlias[this.bank.name],
                accountNumber: this.bank.accountNumber,
                accountName: this.bank.accountName
            }
        }
    },
    mounted() {
        this.getCommission()
        this.getTotal()
        this.getHistory()
        this.getBank()
    },
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
    methods: {
        onWithdraw() {
            // put code here
            this.$bvModal.show("modal-penarikan-komisi");
<<<<<<< HEAD
        },        
=======
        },
        async getCommission() {
            await this.$axios.$get('api/comissions')
                .then((response) => {
                    this.commission = response.data.total || 0
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async getTotal() {
            await this.$axios.$get('api/transaction/total')
                .then((response) => {
                    this.productSold = response.data.total
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async getHistory() {
            this.history = []

            await this.$axios.$get('api/comissions/history')
                .then((response) => {
                    for (const item of response.data) {
                        this.history.push({
                            date: item.created_at,
                            type: item.value > 0 ? 'receive' : 'withdraw',
                            status: 'success',
                            value: item.value
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async getBank() {
            await this.$axios.$get('api/user/bank')
                .then((response) => {
                    if (response.data != null) {
                        this.bank = {
                            name: response.data.type,
                            accountNumber: response.data.account_number,
                            accountName: response.data.fullname,
                            verified: response.data.is_verified,
                        }
                    }
                })
        },
        onSubmit(data) {
            console.log(data)
        },
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
        onPageClick(event, page) {
            this.loading = true
            this.getProductList(page)
        },
    }
}
</script>
