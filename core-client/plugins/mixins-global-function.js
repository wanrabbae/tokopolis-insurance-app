import Vue from 'vue'
import cookie from 'js-cookie'

const mixin ={
    methods: {
        formatPrice(value) {
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            });

            if(value === null) {
                return formatter.format(0);
            }

            return formatter.format(Number(value));
        },
        formatNumber(value) {
            if (value === null) {
                return 0
            }

            return parseInt(value.toString().replace(/[^\d]/g, ''))
        },
        async logout(){
            await cookie.remove('token')
            await cookie.remove('photo')

            await this.$store.commit('setData', { token: null, photo: null })
            await this.$router.app.refresh()

            this.$router.go('/')
        },
        
    },
    
}

Vue.mixin(mixin)