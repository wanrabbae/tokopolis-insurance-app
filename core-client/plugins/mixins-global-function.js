import Vue from 'vue'
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

            const payload = JSON.parse(atob(accessToken.split('.')[1]))

            return payload.role === 5
        },
    },
}

Vue.mixin(mixin)
