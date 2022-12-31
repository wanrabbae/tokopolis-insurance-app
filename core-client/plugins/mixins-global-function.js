import Vue from 'vue'
import cookie from 'js-cookie'

const mixin ={
    methods: {
        formatPrice(value, locales='id-ID', style='currency', currency = 'IDR') {
            const formatter = new Intl.NumberFormat(locales, {
                style,
                currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });

            if(value === null || value === undefined) {
                return formatter.format(0);
            }

            return formatter.format(Number(value));
        },
        formatNumber(value) {
            if (value === null || value === undefined) {
                return 0
            }

            return parseInt(value.toString().replace(/[^\d]/g, ''))
        },
        limit(value, min, max) {
            if(value < min) {
                return min;
            } else if(value > max) {
                return max;
            } else {
                return value;
            }
        },
        isAgent() {
            const accessToken = cookie.get('token')
            if (!accessToken) return false

            const payload = JSON.parse(atob(accessToken.split('.')[1]))

            return payload.role === 5
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