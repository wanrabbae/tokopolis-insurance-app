<template>

    <div class="py-4 py-lg-5" style="background-color: #f6f5fc">

        <div class="container">

            <div class="card border">

                <div class="card-header text-center pb-0">

                    <div class="text-dark fw-bold fs-4 mb-2">Sisa Waktu Pembayaran</div>

                    <div class="text-dark-blue fw-bold">
                        {{ timeLeft === null ? "-- : -- : --" : formattedTimeLeft }}
                    </div>

                </div> <!-- card-header ends -->

                <div class="card-body">

                    <div class="row">

                       <div class="col-12 col-lg-6 mb-4 mb-lg-0">

                            <div class="fw-bold mb-3">Tata Cara Pembayaran</div>

                            <div class="p-3 rounded border">

                                <div class="d-block border-bottom">

                                    <div class="mb-3">
                                        <b-img :src="paymentImages[paymentData.name]" style="max-height: 48px" />
                                    </div>
                                    <div v-if="paymentData.name != 'gopay' || paymentData.name != 'ovo' || paymentData.name != 'shopeepay' || paymentData.name != 'linkaja' || paymentData.name != 'qris'" class="d-block">
                                        <div class="fw-bold mb-1">
                                            <span v-if="paymentData.name === 'mandiri' || paymentData.name === 'bni' || paymentData.name === 'bca' || paymentData.name === 'bri' || paymentData.name === 'permata'">No. Virtual Account</span>
                                            <span v-if="paymentData.name === 'indomaret' || paymentData.name === 'alfamart'">Kode Pembayaran</span>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center mb-2">

                                            <div class="text-dark fw-bold fs-5">{{ paymentData.virtual_number }}</div>

                                            <div class="d-block">

                                                <BaseButton
                                                    id="copy-text"
                                                    type="link"
                                                    classes="p-0 "
                                                    @click="copyToClipboard(paymentData.virtual_number)"
                                                >
                                                    <span class="pl-2">Salin Nomor</span>
                                                </BaseButton>

                                                <b-tooltip
                                                    triggers="click blur"
                                                    target="copy-text"
                                                    :variant="tooltip.success ? 'primary' : 'danger'"
                                                    placement="left"
                                                >
                                                    {{ tooltip.message }}
                                                </b-tooltip>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div v-if="paymentData.name === 'mandiri' || paymentData.name === 'bni' || paymentData.name === 'bca' || paymentData.name === 'bri' || paymentData.name === 'permata'">

                                    <div v-b-toggle.atm-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Melalui ATM</span>
                                    </div>

                                    <b-collapse id="atm-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Di menu Utama, pilih <strong>Bayar / Beli</strong>.</li>
                                            <li>Pilih <strong>Lainnya</strong>.</li>
                                            <li>Pilih <strong>Multi Payment</strong>.</li>
                                            <li>Masukkan <strong>70012</strong> (kode perusahaan Midtrans) dan tekan <strong>Benar</strong>.</li>
                                            <li>Masukkan Nomor Rekening <strong>{{ paymentData.virtual_number }}</strong> dan tekan <strong>Benar</strong>.</li>
                                            <li>Detail pembayaran Anda akan muncul di halaman konfirmasi pembayaran. Jika informasi benar, tekan <strong>Ya</strong>.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.internet-banking-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Melalui Internet Banking</span>
                                    </div>

                                    <b-collapse id="internet-banking-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Di menu Utama, pilih <strong>Bayar / Beli</strong>.</li>
                                            <li>Pilih <strong>Lainnya</strong>.</li>
                                            <li>Pilih <strong>Multi Payment</strong>.</li>
                                            <li>Masukkan <strong>70012</strong> (kode perusahaan Midtrans) dan tekan <strong>Benar</strong>.</li>
                                            <li>Masukkan Nomor Rekening <strong>{{ paymentData.virtual_number }}</strong> dan tekan <strong>Benar</strong>.</li>
                                            <li>Detail pembayaran Anda akan muncul di halaman konfirmasi pembayaran. Jika informasi benar, tekan <strong>Ya</strong>.</li>
                                        </ol>

                                    </b-collapse>

                                </div>

                                <div v-if="paymentData.name === 'gopay' || paymentData.name === 'ovo' || paymentData.name === 'shopeepay' || paymentData.name === 'linkaja' || paymentData.name === 'qris'">

                                    <ol class="py-3">
                                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                        <li>Sed justo odio, ornare sit amet dapibus pellentesque.</li>
                                        <li>Viverra vitae magna. Aenean ut rhoncus libero.</li>
                                        <li>Vitae volutpat nunc.</li>
                                        <li>Viverra vitae magna. Aenean ut rhoncus libero.</li>
                                        <li>Sed justo odio, ornare sit amet dapibus pellentesque.</li>
                                    </ol>

                                    <b-img :src="paymentLinks.qrcode ? paymentLinks.qrcode : paymentLinks.deeplink" alt="QR Code" />

                                </div>

                                <div v-if="paymentData.name === 'indomaret' || paymentData.name === 'alfamart' ">

                                    <ol class="py-3">
                                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                        <li>Sed justo odio, ornare sit amet dapibus pellentesque.</li>
                                        <li>Viverra vitae magna. Aenean ut rhoncus libero.</li>
                                        <li>Vitae volutpat nunc.</li>
                                        <li>Viverra vitae magna. Aenean ut rhoncus libero.</li>
                                        <li>Sed justo odio, ornare sit amet dapibus pellentesque.</li>
                                    </ol>

                                </div>

                            </div>

                       </div> <!-- col-12.col-lg-6 ends -->

                       <div class="col-12 col-lg-6">

                            <div class="fw-bold mb-3">Ringkasan Pembelian</div>

                            <div class="p-3 rounded border mb-4">

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Harga Premi</span>
                                    <span>{{ formatPrice(paymentData.amount) }}</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Biaya Administrasi</span>
                                    <span>{{ formatPrice(paymentData.fee) }}</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Promosi</span>
                                    <span>-</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span class="text-dark-blue fw-bold">Total Pembelian</span>
                                    <span class="text-dark-blue fw-bold">{{ formatPrice(totalPayment) }}</span>
                                </div>

                            </div>

                            <div class="d-block">

                                <BaseButton type="primary" block @click="confirmPayment">Konfirmasi</BaseButton>

                                <BaseButton type="link" block>Batalkan Pembelian</BaseButton>

                            </div>

                       </div> <!-- col-12.col-lg-6 ends -->

                   </div> <!-- row ends -->

                </div> <!-- card-body ends -->

            </div> <!-- card ends -->

        </div> <!-- container ends -->

        <Loading :show="loading"/>

    </div>

</template>

<script>
import Loading from '../../../../components/Loading'

export default {
    components:{
        Loading
    },
    data() {
        return {
            title: 'Konfirmasi Pembayaran',
            loading : true,
            paymentData: {
                // "type": "ewallet",
                // "name": "qris",
                // "transaction_id": "ccaf041f-5281-4b97-ae2d-d6705e53aa63",
                // "virtual_number": "265258754309",
                // "amount": "8308660.00",
                // "status": "pending"
            },
            paymentLinks: {
                "website": null,
                "mobile": null,
                "deeplink": "https://api.sandbox.midtrans.com/v2/qris/ccaf041f-5281-4b97-ae2d-d6705e53aa63/qr-code",
                "qrcode": null
            },
            paymentImages: {
                mandiri: "/img/logo-large-mandiri.png",
                bni: "/img/logo-large-bni.png",
                bca: "/img/logo-large-bca.png",
                bri: "/img/logo-large-bri.png",
                permata: "/img/logo-large-permata.png",
                qris: "/img/logo-large-qris.png",
                gopay: "/img/logo-large-gopay.png",
                shopeepay: "/img/logo-large-shopeepay.png",
                dana: "/img/logo-large-dana.png",
                linkaja: "/img/logo-large-linkaja.png",
                indomaret: "/img/logo-large-indomaret.png",
                alfamart: "/img/logo-large-alfamart.png",
            },
            timeLeft: null,
            tooltip: {
                success: false,
                message: null
            },
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    },
    computed: {
        formattedTimeLeft() {
            const timeLeft = this.timeLeft;
            let hours = Math.floor((timeLeft / (1000 * 60 * 60)));
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            return `${hours} : ${minutes} : ${seconds}`;
        },
        totalPayment() {
            // return this.premiumPrice + this.administrationCost + this.discount;
            return this.paymentData.amount;
        }
    },
    deactivated(){
        this.$destroy()

    },
    created(){
        // this.$destroy()
        this.transactionId = this.$store.state.transaction_id
    },
    mounted() {
        this.startTimer();
        this.getTransactionReview();
    },
    methods: {
        startTimer() {
            this.timerInterval = setInterval(() => {
                const currentTime = new Date().getTime();
                this.timeLeft = new Date(this.paymentData.due ).getTime() - currentTime;
            }, 1000);
        },
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.tooltip.success = true;
                this.tooltip.message = 'Berhasil menyalin';
            } catch(err) {
                this.tooltip.success = false;
                this.tooltip.message = 'Gagal menyalin: ' + err;
            }
        },
        async getTransactionReview() {
            await this.$axios.$get(`api/transaction/payment?transaction_id=${this.transactionId}`)
                .then ((response) => {
                    console.log(response)
                    if(response.data.status !=="waiting"){
                        this.$router.push({name: "index"})
                        this.$store.commit('setProductId',null)
                        this.$store.commit('setTransactionId',null)
                    }
                    this.paymentData = response.data.pg_data
                    this.paymentData.amount = response.data.total
                    console.log(this.paymentData)
                    this.timeLeft = new Date(this.paymentData.due).getTime()
                    // this.dueDateTime = new Date(paymentData.due).getTime()
                    // this.account.name = paymentData.name
                    // this.account.image = this.image[paymentData.name]
                    // this.account.number = paymentData.virtual_number
                    // this.premiumPrice = response.data.total
                    // this.administrationCost = paymentData.fee
                    this.loading = false
                })
                .catch (error => {
                    if(error.response.status === 400){
                        this.$router.push({name: "asuransi-mobil-polis-review-pembelian"})
                    }
                })
        },
        confirmPayment(){
            this.$router.push({name: "daftar-polis"})
        }
    }
}
</script>
