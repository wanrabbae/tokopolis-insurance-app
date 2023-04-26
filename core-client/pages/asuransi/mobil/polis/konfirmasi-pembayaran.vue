<template>

    <div class="py-6" style="background-color: #f6f5fc">

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

                       <div class="col-12 col-md-6 mb-4 mb-md-0">

                            <div class="fw-bold mb-3">Tata Cara Pembayaran</div>

                            <div class="p-3 rounded border">

                                <div class="d-block border-bottom">

                                    <div class="mb-3">
                                        <b-img 
                                            height="48"
                                            :src="paymentImages[paymentData.name]" 
                                        />
                                    </div>
                                    <div v-if="paymentData.name != 'gopay' || paymentData.name != 'ovo' || paymentData.name != 'shopeepay' || paymentData.name != 'linkaja' || paymentData.name != 'qris'" class="d-block">
                                        <div class="fw-bold mb-1">
                                            <span v-if="paymentData.name === 'mandiri' || paymentData.name === 'bni' || paymentData.name === 'bca' || paymentData.name === 'bri' || paymentData.name === 'permata'">No. Virtual Account</span>
                                            <span v-if="paymentData.name === 'indomaret' || paymentData.name === 'alfamart'">Kode Pembayaran</span>
                                        </div>

                                        <div v-if="paymentData.virtual_number != null" class="d-flex justify-content-between align-items-center mb-2">

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

                                <div v-if="paymentData.name === 'mandiri'">

                                    <div v-b-toggle.mobile-banking-mandiri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Mobile Banking</span>
                                    </div>

                                    <b-collapse id="mobile-banking-mandiri-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Buka aplikasi Livin by Mandiri dan masukkan PIN.</li>
                                            <li>Pilih menu <strong>Bayar</strong>.</li>
                                            <li>Pilih <strong>Buat Pembayaran Baru</strong>.</li>
                                            <li>Pilih <strong>Multi Payment</strong>.</li>
                                            <li>Pilih <strong>Penyedia Jasa 88908 XENDIT</strong>.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Masukkan nominal transfer.</li>
                                            <li>Tulis keterangan bila perlu, klik <strong>Lanjut</strong>.</li>
                                            <li>Masukkan MPIN untuk menyelesaikan transaksi.</li>
                                            <li>Unduh bukti transfer sebagai bukti pembayaran sah.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.internet-banking-mandiri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Internet Banking</span>
                                    </div>

                                    <b-collapse id="internet-banking-mandiri-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Kunjungi website Mandiri Internet Banking, pada alamat <a href="https://ibank.bankmandiri.co.id/retail3" target="_blank">https://ibank.bankmandiri.co.id/retail3</a>.</li>
                                            <li>Login dengan masukkan USER ID dan PASSWORD.</li>
                                            <li>Masukkan ke halaman <strong>Beranda</strong>, lalu pilih <strong>Bayar</strong>.</li>
                                            <li>Pilih <strong>Multi Payment</strong>.</li>
                                            <li>Pilih <strong>No Rekening Anda</strong>.</li>
                                            <li>Pilih <strong>Penyedia Jasa 88908 XENDIT</strong>.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Masuk ke halaman konfirmasi 1.</li>
                                            <li>Jika benar/sesuai, klik tombol tagihan TOTAL, lalu klik <strong>Lanjutkan</strong>.</li>
                                            <li>Masuk ke halaman konfirmasi 2.</li>
                                            <li>Masukkan Challenge Code yang dikirimkan ke Token Internet Banking kami, klik <strong>Kirim</strong>.</li>
                                            <li>Masuk ke halaman konfirmasi pembayaran telah selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.atm-mandiri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">ATM</span>
                                    </div>

                                    <b-collapse id="atm-mandiri-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Masukkan kartu ATM dan Pilih Bahasa.</li>
                                            <li>Masukkan PIN.</li>
                                            <li>Pilih menu <strong>BAYAR/BELI</strong>, lalu pilih <strong>Multi Payment</strong>.</li>
                                            <li>Ketik kode perusahaan, yaitu <strong>88908</strong> XENDIT, tekan <strong>Benar</strong>.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Isi nominal kemudian tekan <strong>Benar</strong>.</li>
                                            <li>Muncul konfirmasi customer. Pilih Nomor 1 sesuai tagihan yang akan dibayar. Kemudian tekan <strong>YA</strong>.</li>
                                            <li>Muncul konfirmasi pembayaran, Tekan <strong>YA</strong> untuk melakukan pembayaran.</li>
                                            <li>Simpan struk pembayaran.</li>
                                            <li>Transaksi selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                </div>

                                <div v-if="paymentData.name === 'bni'">

                                    <div v-b-toggle.mobile-banking-bni-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Mobile Banking</span>
                                    </div>

                                    <b-collapse id="mobile-banking-bni-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Masukkan user ID dan Password.</li>
                                            <li>Pilih menu <strong>Transfer</strong>.</li>
                                            <li>Pilih menu <strong>Virtual Account Billing</strong> kemudian pilih rekening debet.</li>
                                            <li>Masukkan nomor virtual account yang dituju pada menu <strong>Input Baru</strong>.</li>
                                            <li>Tagihan yang harus dibayarkan akan muncul pada layar konfirmasi.</li>
                                            <li>Konfirmasi transaksi dan masukkan password kamu.</li>
                                            <li>Pembayaran kami telah selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.internet-banking-bni-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Internet Banking</span>
                                    </div>

                                    <b-collapse id="internet-banking-bni-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Ketik alamat <a href="https://ibank.bni.co.id" target="_blank">https://ibank.bni.co.id</a> kemudian klik <strong>Enter</strong>.</li>
                                            <li>Masukkan user ID dan Password.</li>
                                            <li>Pilih menu <strong>Transfer</strong>.</li>
                                            <li>Pilih menu <strong>Virtual Account Billing</strong>.</li>
                                            <li>Kemudian masukkan nomor virtual account yang akan dibayar.</li>
                                            <li>Pilih rekening debet yang akan digunakan, kemudian klik <strong>Lanjut</strong>.</li>
                                            <li>Kemudian tagihan yang harus dibayarkan akan muncul pada layar konfirmasi.</li>
                                            <li>Masukkan kode otentikasi token.</li>
                                            <li>Pembayaran kami telah berhasil.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.atm-bni-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">ATM</span>
                                    </div>

                                    <b-collapse id="atm-bni-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Masukkan kartu kami.</li>
                                            <li>Pilih Bahasa.</li>
                                            <li>Masukkan PIN ATM kami.</li>
                                            <li>Pilih <strong>Menu lainnya</strong>.</li>
                                            <li>Pilih <strong>Transfer</strong>.</li>
                                            <li>Pilih jenis rekening yang akan kami gunakan (contoh: <strong>Dari Rekening Buku Tabungan</strong>).</li>
                                            <li>Pilih <strong>Virtual Account Billing</strong>.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Tagihan yang dibayarkan akan muncul pada layar konfirmasi.</li>
                                            <li>Jika sudah sesuai, lanjutkan transaksi.</li>
                                            <li>Transaksi kamu telah selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                </div>

                                <div v-if="paymentData.name === 'bca'">

                                    <div v-b-toggle.mobile-banking-bca-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Mobile Banking</span>
                                    </div>

                                    <b-collapse id="mobile-banking-bca-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Buka aplikasi BCA Mobile.</li>
                                            <li>Pilih <strong>m-BCA</strong>, kemudian pilih <strong>m-Transfer</strong>.</li>
                                            <li>Pilih <strong>BCA Virtual Account</strong>.</li>
                                            <li>Masukkan nomor virtual account, lalu pilih <strong>OK</strong>.</li>
                                            <li>Klik <strong>Send</strong> yang ada di sudut kanan atas aplikasi untuk melakukan transfer.</li>
                                            <li>Klik <strong>OK</strong> untuk melanjutkan pembayaran.</li>
                                            <li>Masukkan PIN kamu untuk meng-otorisasi transaksi.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.internet-banking-bca-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Internet Banking</span>
                                    </div>

                                    <b-collapse id="internet-banking-bca-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Login ke KlikBCA Individual.</li>
                                            <li>Pilih Transfer, kemudian pilih Transfer ke BCA Virtual Account.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Pilih <strong>Lanjutkan</strong> untuk melanjutkan pembayaran.</li>
                                            <li>Masukkan <strong>RESPON KEYBCA APPLI 1</strong> yang muncul pada Token BCA kamu, lalu klik <strong>Kirim</strong>.</li>
                                            <li>Transaksi kamu sudah selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.atm-bca-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">ATM</span>
                                    </div>

                                    <b-collapse id="atm-bca-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Masukkan kartu ATM dan PIN BCA kamu.</li>
                                            <li>Di menu utama, pilih <strong>Transaksi Lainnya</strong>, lalu <strong>Transfer</strong>, dan klik <strong>Ke BCA Virtual Account</strong>.</li>
                                            <li>Masukkan nomor virtual account.</li>
                                            <li>Pastikan data virtual account kamu benar, kemudian masukkan angka yang perlu dibayarkan, kemudian pilih <strong>Benar</strong>.</li>
                                            <li>Cek dan perhatikan konfirmasi pembayaran dari layar ATM, jika sudah benar pilih <strong>Ya</strong>, atau pilih <strong>Tidak</strong> jika data di layar masih salah.</li>
                                            <li>Transaksi kamu sudah selesai.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                </div>

                                <div v-if="paymentData.name === 'bri'">

                                    <div v-b-toggle.mobile-banking-bri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Mobile Banking</span>
                                    </div>

                                    <b-collapse id="mobile-banking-bri-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Login ke BRI Mobile Banking, masukkan USER ID dan PIN kamu.</li>
                                            <li>Pilih <strong>Pembayaran</strong>, lalu pilih <strong>Briva</strong>.</li>
                                            <li>Masukkan nomor virtual account dan nominal yang akan dibayar.</li>
                                            <li>Masukkan nomor PIN kamu dan klik <strong>Kirim</strong>.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.internet-banking-bri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Internet Banking</span>
                                    </div>

                                    <b-collapse id="internet-banking-bri-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Ketik alamat <a href="https://ib.bni.co.id/ib-bri" target="_blank">https://ib.bni.co.id/ib-bri</a> , masukkan USER ID dan PASSWORD.</li>
                                            <li>Pilih <strong>Pembayaran</strong>, lalu pilih <strong>Briva</strong>.</li>
                                            <li>Masukkan nomor virtual account dan nominal yang akan dibayar, lalu klik <strong>Kirim</strong>.</li>
                                            <li>Masukkan kembali password serta kode otentikasi mToken internet banking.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                    <div v-b-toggle.atm-bri-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">ATM</span>
                                    </div>

                                    <b-collapse id="atm-bri-payment-accordion" accordion="payment-accordion" role="tabpanel">

                                        <ol class="pt-3">
                                            <li>Masukkan kartu, pilih Bahasa kemudian masukkan PIN kamu.</li>
                                            <li>Pilih <strong>Transaksi Lain</strong>, lalu pilih <strong>Pembayaran</strong>.</li>
                                            <li>Pilih <strong>Lainnya</strong>, lalu pilih <strong>Briva</strong>.</li>
                                            <li>Masukkan nomor virtual account dan nominal yang akan dibayar.</li>
                                            <li>Periksa kembali data transaksi kemudian tekan <strong>YA</strong>.</li>
                                            <li>Setelah transaksi pembayaran selesai, invoice akan diperbarui secara otomatis dalam waktu maksimal 5 menit.</li>
                                        </ol>

                                    </b-collapse>

                                </div>

                                <div v-if="paymentData.name === 'permata'">

                                    <div v-b-toggle.atm-payment-accordion class="position-relative border-bottom chevron pointer py-3">
                                        <span class="fw-bold">Melalui ATM</span>
                                    </div>

                                    <b-collapse id="atm-payment-accordion" accordion="payment-accordion" role="tabpanel" class="border-bottom" visible>

                                        <ol class="py-3">
                                            <li>Di menu Utama, pilih <strong>Bayar / Beli</strong>.</li>
                                            <li>Pilih <strong>Lainnya</strong>.</li>
                                            <li>Pilih <strong>Multi Payment</strong>.</li>
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

                                    <nuxt-img 
                                        v-if="paymentData.name === 'qris'"
                                        preset="default"
                                        :src="paymentLinks.qrcode ? paymentLinks.qrcode : paymentLinks.deeplink" 
                                        alt="QR Code" 
                                    />

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

                       </div> <!-- col-12.col-md-6 ends -->

                       <div class="col-12 col-md-6">

                            <div class="fw-bold mb-3">Ringkasan Pembelian</div>

                            <div class="p-3 rounded border mb-4">

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Harga Premi</span>
                                    <span>{{ formatPrice(paymentPrice.total - paymentPrice.fee_admin - paymentPrice.fee_stamp) }}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Biaya Admin</span>
                                    <span>{{ formatPrice(paymentPrice.fee_admin) }}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Biaya Materai</span>
                                    <span>{{ formatPrice(paymentPrice.fee_stamp) }}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Biaya Layanan</span>
                                    <span>{{ formatPrice(paymentPrice.fee_pg) }}</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span>Promosi</span>
                                    <span>-</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2 mb-last-0">
                                    <span class="text-dark-blue fw-bold">Total Pembelian</span>
                                    <span class="text-dark-blue fw-bold">{{ formatPrice(paymentData.amount) }}</span>
                                </div>

                            </div>

                            <div class="d-block">

                                <BaseButton type="primary" block @click="confirmPayment">Konfirmasi</BaseButton>

                                <BaseButton type="link" block @click="cancelPayment">Batalkan Pembelian</BaseButton>

                            </div>

                       </div> <!-- col-12.col-md-6 ends -->

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
            transactionId: null,
            paymentData: {
                // "type": "ewallet",
                // "name": "qris",
                // "transaction_id": "ccaf041f-5281-4b97-ae2d-d6705e53aa63",
                // "virtual_number": "265258754309",
                // "amount": "8308660.00",
                // "status": "pending"
            },
            paymentPrice:{},
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
                bsi: "/img/logo-bsi.png",
                bjb: "/img/logo-bjb.png",
                permata: "/img/logo-large-permata.png",
                qris: "/img/logo-large-qris.png",
                gopay: "/img/logo-large-gopay.png",
                ovo: "/img/logo-large-ovo.png",
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
        async cancelPayment() {
            await this.$axios.$post('/api/transaction/payment/cancel', { id: this.$route.query.id })
                .then((resp) => {
                    self.$router.push({
                        name: "asuransi-mobil-polis-review-pembelian",
                        query: {
                            id: this.$route.query.id
                        }
                    })
                })
        },
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
            await this.$axios.$get(`api/transaction/payment?transaction_id=${this.$route.query.id}`)
                .then ((response) => {
                    if(response.data.status !=="waiting"){
                        // this.$router.push({name: "index"})
                        this.$router.push({name: "daftar-polis"})
                        this.$store.commit('setProductId',null)
                        this.$store.commit('setTransactionId',null)
                    }

                    this.paymentData = response.data.pg_data
                    this.paymentPrice = response.data

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
        },
        
    }
}
</script>