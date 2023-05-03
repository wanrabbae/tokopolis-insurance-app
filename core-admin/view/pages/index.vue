<template>
    <div>
        <PageHeader :title="title" :items="items" />

        <!-- <Stat /> -->

        <div v-if="eccount.role_id !== 1 || eccount.length == 0" class="row">
            <div class="col-3">
                <div class="card card-summary card-point">
                    <div class="card-header">
                        Total Points
                    </div>
                    <div class="card-body">
                        {{ Intl.NumberFormat().format(totalPoint) }}
                    </div>
                </div>
            </div>
            <div v-if="eccount.role_id !== 1 || eccount.length == 0" class="col-3">
                <div class="card card-summary card-commission">
                    <div class="card-header">
                        Total Commission
                    </div>
                    <div class="card-body">
                        {{ Intl.NumberFormat().format(totalCommission) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- <SalesAnalytics /> -->
            <div class="col-xl-4">
                <div class="card bg-primary">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-sm-8">
                                <p class="text-white font-size-18">
                                    Enhance your
                                    <b>Campaign</b> for better outreach
                                    <i class="mdi mdi-arrow-right"></i>
                                </p>
                                <div class="mt-4">
                                    <a href="javascript: void(0);" class="btn btn-success waves-effect waves-light">Upgrade Account!</a>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="mt-4 mt-sm-0">
                                    <img src="~/assets/images/setup-analytics-amico.svg" class="img-fluid" alt />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end card-body-->
                </div>
                <!-- end card-->
                <!-- <SellingProduct /> -->
            </div>
        </div>

        <!--
        <div class="row">
            <TopUsers />
            <Activity />
            <SocialSource />
        </div>
        -->
    </div>
</template>

<script>
/**
 * Dashboard component
 */
export default {
    layout: 'admin',
    data() {
        return {
            title: "Dashboard",
            items: [{
                    text: "Minible",
                },
                {
                    text: "Dashboard",
                    active: true,
                },
            ],
            eccount: [],
            totalPoint: 0,
            totalCommission: 0,
        };
    },
    head() {
        return {
            title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`,
        };
    },
    created() {
        this.getAccount()
        this.getTotalPoint()
        this.getTotalCommission()
    },
    methods: {
        async getAccount() {
            this.eccount = await this.$axios.$get('api/admin/account')
                .then ((response) => {
                    return response.data;
                })
        },
        async getTotalPoint() {
            if (this.eccount.role_id > 1 && this.eccount.role_id === 5) {
                this.totalPoint = await this.$axios.$get('api/point')
                .then((response) => {
                    return response.data.total === null ? 0 : response.data.total
                })
            } else {
                this.totalPoint = await this.$axios.$get('api/point/under-agents')
                .then((response) => {
                    let total = 0;
                    response.data.forEach((item) => {
                        total += parseInt(item.value);
                    })

                    return total
                })
            }
        },
        async getTotalCommission() {
            if (this.eccount.role_id > 1 && this.eccount.role_id === 5) {
                this.totalPoint = await this.$axios.$get('api/comissions')
                .then((response) => {
                    return response.data.total === null ? 0 : response.data.total
                })
            } else {
                this.totalPoint = await this.$axios.$get('api/comissions/underAgents')
                .then((response) => {
                    let total = 0;
                    response.data.forEach((item) => {
                        total += parseInt(item.value);
                    })

                    return total
                })
            }
            // if (this.eccount.role_id > 1) {
            //     this.totalCommission = await this.$axios.$get('api/comissions')
            //     .then((response) => {
            //         return response.data.total === null ? 0 : response.data.total
            //     })
            // }
        }
    }
};
</script>

<style>
    .card-summary > .card-header {
        font-size: 12pt;
        font-weight: bold;
    }

    .card-summary > .card-body {
        font-size: 36pt;
        font-weight: bold;
        text-align: right;
    }

    .card-point > .card-header {
        background-color: rgb(250, 250, 142);
    }

    .card-point > .card-body {
        background-color: rgb(217, 217, 2);
    }

    .card-commission > .card-header {
        background-color: rgb(138, 255, 148);
    }

    .card-commission > .card-body {
        background-color: rgb(102, 215, 111);
    }
</style>
