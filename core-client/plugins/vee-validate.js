import { extend } from 'vee-validate';

extend('price_between', {
    validate(value, { min, max }) {
        value = Number(value.toString().replace(/[^\d]/g, ""));
        min = Number(min.toString().replace(/[^\d]/g, ""));
        max = Number(max.toString().replace(/[^\d]/g, ""));

        return min <= value && max >= value;
    },
    params: ['min', 'max'],
    message: '{_field_} harus di antara {min} dan {max}'
});