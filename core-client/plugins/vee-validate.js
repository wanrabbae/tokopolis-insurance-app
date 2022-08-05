import { extend } from 'vee-validate';

extend('price_between', {
    validate(value, { min, max }) {
        value = Number(value.toString().replace(/[^\d]/g, ""));

        return Number(min.toString().replace(/[^\d]/g, "")) <= value && Number(max.toString().replace(/[^\d]/g, "")) >= value;
    },
    params: ['min', 'max'],
    message: '{_field_} harus di antara {min} dan {max}'
});