<template>
    <div>
        <br></br>
        <div class="my-5">

            <b-container>

                <div class="text-center">
                    <h1 class="mb-5"><u>Layanan Kami</u></h1>
                </div>

                <div class="row align-items-center mb-5 p-3" style="border: 1px solid; border-radius: 5px; box-shadow: 5px 5px #888888">

                    <div class="col-12 col-md-2 text-right">

                        <b-img src="/svg/computer.svg" alt="Computer Icon" width="100px"  style="max-height: 160px" />

                    </div> <!-- col-12.col-md-3 ends -->

                    <div class="col-12 col-md-10">

                        <p>
                            Menyediakan informasi, peralatan fitur aplikasi, hingga kecerdasan buatan yang dapat 
                            membantu anda memberikan pemahaman yang lebih mudah, membandingkan informasi produk 
                            sesuai kebutuhan asuransi, informasi fitur dan manfaat dari perusahaan asuransi, hingga 
                            bantuan proses klaim secara digital dan real-time atas proses yang sedang berlangsung.
                        </p>

                    </div> <!-- col-12.col-md-9 ends -->

                </div> <!-- row ends -->

                <div class="row align-items-center mb-5  p-3" style="border: 1px solid; border-radius: 5px; box-shadow: 5px 5px #888888">

                    <div class="col-12 col-md-2">

                        <b-img src="/svg/claim.svg" alt="Claim Icon" width="100px"  style="max-height: 160px"/>

                    </div>

                    <div class="col-12 col-md-10">

                        <p>
                            Menyediakan jasa konsultansi, rekomendasi, hingga memberikan bantuan
                            klaim asuransi secara digital
                        </p>

                    </div>

                </div> <!-- row ends -->

                <div class="row align-items-center mb-5  p-3" style="border: 1px solid; border-radius: 5px; box-shadow: 5px 5px #888888">

                    <div class="col-12 col-md-2 text-right">

                        <b-img src="/svg/insurance.svg" alt="Insurance Icon" width="100px" style="max-height: 160px"></b-img>

                    </div>

                    <div class="col-12 col-md-10">

                        <p>
                            Menyediakan berbagai produk asuransi sesuai kebutuhan anda
                        </p>

                    </div>

                </div> <!-- row ends -->

                <div class="row align-items-center mb-5  p-3" style="border: 1px solid; border-radius: 5px; box-shadow: 5px 5px #888888">

                    <div class="col-12 col-md-2">

                        <b-img src="/svg/payment.svg" alt="Payment Icon" width="100px" style="max-height: 160px" />

                    </div> <!-- col-12 col-md-3 ends -->

                    <div class="col-12 col-md-10">

                        <p>
                            Menyediakan sistem pembayaran yang aman, mudah, dan simple sesuai
                            dengan kebutuhan anda
                        </p>

                    </div> <!-- col-12 col-md-9 ends -->

                </div> <!-- row ends -->

                <div class="row align-items-center mb-5  p-3" style="border: 1px solid; border-radius: 5px; box-shadow: 5px 5px #888888">

                    <div class="col-12 col-md-2 text-right">

                        <b-img src="/svg/shield.svg" alt="Shield Icon" width="100px" style="max-height: 160px"></b-img>

                    </div> <!-- col-12 col-md-3 ends -->

                    <div class="col-12 col-md-10">

                        <p>
                            Menyediakan sistem bantuan proses klaim secara digital yang diakses melalui
                            platform TOKOPOLIS, dan tak terbatas pelayanan kami menggunakan perangkat lain seperti
                            email, whatsapp, dan telepon guna memberikan bantuan secara maksimal
                            kepada anda.
                        </p>

                    </div> <!-- col-12 col-md-9 ends -->

                </div> <!-- row ends -->

            </b-container> <!-- container ends -->

        </div>
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
