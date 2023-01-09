<template>

    <div class="py-6" style="background-color: #f6f5fc">

        <div class="container">

            <div class="card border">

                <div class="card-body text-center">

                    <div class="row">
                        <div class="col-md-12" style="padding-top: 30px; padding-bottom: 30px">
                            
                            <b-img center src="/img/failed.png" alt="Payment Icon" width="100px" style="max-height: 160px;"/>
                            <h4 class="text-secondary mt-2">Pembayaran Gagal</h4>

                            <a href="/daftar-polis" class="btn btn-sm mt-4 btn-primary">Lihat History Transaksi</a>

                        </div>
                    </div>

                </div> <!-- card-body ends -->

            </div> <!-- card ends -->

        </div> <!-- container ends -->

        <!-- <Loading :show="loading"/> -->

    </div>

</template>

<script>
// import Loading from '../../../../components/Loading'

export default {
    components:{
        // Loading
    },
    data() {
        return {
            title: 'Pembayaran Berhasil',
            // loading : true,
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
    mounted() {
        this.startTimer();
    },
    methods: {
        startTimer() {
            this.timerInterval = setInterval(() => {
                const currentTime = new Date().getTime();
                this.timeLeft = new Date(this.paymentData.due ).getTime() - currentTime;
            }, 1000);
        },     
        goToTransaction() {

        }  
    }
}
</script>
