import Vue from 'vue'
<<<<<<< HEAD
import cookie from 'js-cookie'
=======
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
import atob from 'atob'

const mixin = {
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
            const accessToken = this.$store.state.token
            if (!accessToken) return false
<<<<<<< HEAD

            const payload = JSON.parse(atob(accessToken.split('.')[1]))

            return payload.role === 5
        },
        async logout(){
            await cookie.remove('token')
            await cookie.remove('photo')
=======
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

            const payload = JSON.parse(atob(accessToken.split('.')[1]))

            return payload.role === 5
        },
    },
}

Vue.mixin(mixin)
