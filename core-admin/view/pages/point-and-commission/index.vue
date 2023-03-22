<template>
    <div>
        <PageHeader :title="title" />
        <div class="row">
            <div class="col-12">
                <b-card no-body>
                    <b-tabs card>
                    <b-tab title="Points" active>
                        <b-card-text>
                            <Points />
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Commissions">
                        <b-card-text>
                            <Commissions />
                        </b-card-text>
                    </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>

import Points from '../../components/Points.vue'
import Commissions from '../../components/Commissions.vue'

export default {
    components: {
        Points,
        Commissions
    },
    layout: 'admin',
    data() {
        return {
            title: 'Point and Commission'
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`
        }
    },
}

</script>