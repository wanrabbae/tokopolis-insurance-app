import Vue from 'vue'

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
    },

}

Vue.mixin(mixin)