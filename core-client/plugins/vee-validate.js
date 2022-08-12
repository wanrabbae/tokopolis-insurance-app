import Vue from 'vue'
import { extend, localize, ValidationProvider, ValidationObserver } from 'vee-validate'
/* eslint import/namespace: ['error', { allowComputed: true }] */
import * as rules from 'vee-validate/dist/rules'
import id from 'vee-validate/dist/locale/id.json'

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
});

localize('id', id)

extend('price_between', {
  validate(value, { min, max }) {
      value = Number(value.toString().replace(/[^\d]/g, ""));
      min = Number(min.toString().replace(/[^\d]/g, ""));
      max = Number(max.toString().replace(/[^\d]/g, ""));

      return min <= value && max >= value;
  },
  params: ['min', 'max'],
  message: '{_field_} harus di antara {min} dan {max}'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)