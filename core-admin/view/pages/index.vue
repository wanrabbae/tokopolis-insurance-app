<template>
    <div>
        <PageHeader :title="title" :items="items" />

        <!-- <Stat /> -->

        <div class="row" v-if="eccount.role_id !== 1">
            <div class="col-3">
                <div class="card card-summary card-point">
                    <div class="card-header">
                        Total Points
                    </div>
                    <div class="card-body">
                        {{ totalPoint }}
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card card-summary card-commission">
                    <div class="card-header">
                        Total Commission
                    </div>
                    <div class="card-body">
                        {{ totalCommission }}
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
                return this.eccount;
        },
        async getTotalPoint() {
            this.totalPoint = await this.$axios.$get('/api/point/under-agents')
                .then((response) => {
                    return response.data.value;
                })
        },
        async getTotalCommission() {
            this.totalCommission = await this.$axios.$get('api/commissions')
                .then((response) => {
                    return response.total
                })
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
