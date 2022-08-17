<template>

    <div class="my-5">

        <div class="container">

            <h1>Layanan Kami</h1>

            <div class="row align-items-center mb-4">

                <div class="col-12 col-lg-3 text-right">

                    <b-img src="/svg/computer.svg" alt="Computer Icon"  style="max-height: 160px" />

                </div> <!-- col-12.col-lg-3 ends -->

                <div class="col-12 col-lg-9 text-right">

                    <p>
                        Menyediakan informasi, peralatan fitur aplikasi, hingga kecerdasan buatan yang
                        dapat membantu anda memberikan pemahaman yang lebih mudah,
                        membandingkan informasi produk sesuai kebutuhan asuransi, informasi fitur
                        dan manfaat dari perusahaan asuransi, hingga bantuan proses klaim secara
                        digital dan real-time atas proses yang sedang berlangsung
                    </p>

                </div> <!-- col-12.col-lg-9 ends -->

            </div> <!-- row ends -->

            <div class="row align-items-center mb-4">

                <div class="col-12 col-lg-3">

                    <b-img src="/svg/claim.svg" alt="Claim Icon"  style="max-height: 160px"/>

                </div>

                <div class="col-12 col-lg-9">

                    <p>
                        Menyediakan jasa konsultansi, rekomendasi, hingga memberikan bantuan
                        klaim asuransi secara digital
                    </p>

                </div>

            </div> <!-- row ends -->

            <div class="row align-items-center mb-4">

                <div class="col-12 col-lg-3 text-right">

                    <b-img src="/svg/insurance.svg" alt="Insurance Icon"  style="max-height: 160px"></b-img>

                </div>

                <div class="col-12 col-lg-9">

                    <p>
                        Menyediakan berbagai produk asuransi sesuai kebutuhan anda
                    </p>

                </div>

            </div> <!-- row ends -->

            <div class="row align-items-center mb-4">

                <div class="col-12 col-lg-3">

                    <b-img src="/svg/payment.svg" alt="Payment Icon"  style="max-height: 160px" />

                </div> <!-- col-12 col-lg-3 ends -->

                <div class="col-12 col-lg-9">

                    <p>
                        Menyediakan sistem pembayaran yang aman, mudah, dan simple sesuai
                        dengan kebutuhan anda
                    </p>

                </div> <!-- col-12 col-lg-9 ends -->

            </div> <!-- row ends -->

            <div class="row align-items-center mb-4">

                <div class="col-12 col-lg-3 text-right">

                    <b-img src="/svg/shield.svg" alt="Shield Icon"  style="max-height: 160px"></b-img>

                </div> <!-- col-12 col-lg-3 ends -->

                <div class="col-12 col-lg-9">

                    <p>
                        Menyediakan sistem bantuan proses klaim secara digital yang diakses melalui
                        platform PIQO, dan tak terbatas pelayanan kami menggunakan perangkat lain seperti
                        email, whatsapp, dan telepon guna memberikan bantuan secara maksimal
                        kepada anda.
                    </p>

                </div> <!-- col-12 col-lg-9 ends -->

            </div> <!-- row ends -->

        </div> <!-- container ends -->

    </div>

</template>

<script>
export default {
    data() {
        return {
            title: 'Layanan',
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    }
}
</script>
