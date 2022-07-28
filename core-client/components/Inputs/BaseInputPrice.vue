<template>
  <b-form-group>
    <validation-provider v-slot="{errors, valid, invalid, validated}" :rules="rules" :name="name">
      <slot name="label">
        <label v-if="label" :class="labelClasses">
          {{label}}
        </label>
      </slot>
      <div :class="[
        {'input-group': hasIcon},
        {'focused': focused},
        {'input-group-alternative': alternative},
        {'has-label': label || $slots.label},
        inputGroupClasses
      ]">
        <div v-if="prependIcon || $slots.prepend" class="input-group-prepend">
          <slot name="prepend">
            <span class="input-group-text">
              <fa :icon="prependIcon"/>
            </span>
          </slot>
        </div>
        <slot v-bind="slotData">
          <input
            :value="value"
            :type="type"
            v-bind="$attrs"
            :valid="valid"
            :required="required"
            class="form-control"
            :class="[
              {'is-valid': valid && validated && successMessage},
              {'is-invalid': invalid && validated}, 
              inputClasses
            ]"
            :style="[
              prependIcon || $slots.prepend ? { borderTopLeftRadius: '0 !important', borderBottomLeftRadius: '0 !important' } : null, 
              appendIcon || $slots.append ? { borderTopRightRadius: '0 !important', borderBottomRightRadius: '0 !important' } : null
            ]"
            v-on="listeners">
        </slot>
        <div v-if="appendIcon || $slots.append" class="input-group-append">
          <slot name="append">
            <span class="input-group-text">
              <fa :icon="appendIcon"/>
            </span>
          </slot>
        </div>
        <slot name="infoBlock"></slot>
      </div>
      <slot name="success">
        <div v-if="valid && validated && successMessage" class="valid-feedback">
          {{successMessage}}
        </div>
      </slot>
      <slot name="error">
        <div v-if="errors[0]" class="invalid-feedback" style="display: block;">
          {{ errors[0] }}
        </div>
      </slot>
    </validation-provider>
  </b-form-group>
</template>
<script>
import {  ValidationProvider } from 'vee-validate';
  export default {
    name: 'BaseInput',
    components: {
      'validation-provider': ValidationProvider
    },
    inheritAttrs: false,
    props: {
      required: {
        type: Boolean,
        description: "Whether input is required (adds an asterix *)"
      },
      group: {
        type: Boolean,
        description: "Whether input is an input group (manual override in special cases)"
      },
      alternative: {
        type: Boolean,
        description: "Whether input is of alternative layout"
      },
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      error: {
        type: String,
        description: "Input error (below input)"
      },
      successMessage: {
        type: String,
        description: "Input success message",
        default: ''
      },
      labelClasses: {
        type: String,
        description: "Input label css classes",
        default: "form-control-label"
      },
      inputClasses: {
        type: String,
        description: "Input css classes"
      },
      inputGroupClasses: {
        type: String,
        description: "Input group css classes"
      },
      value: {
        type: [String, Number],
        description: "Input value"
      },
      type: {
        type: String,
        description: "Input type",
        default: "text"
      },
      appendIcon: {
        type: [String, Array],
        description: "Append icon (right)"
      },
      prependIcon: {
        type: [String, Array],
        description: "Prepend icon (left)"
      },
      rules: {
        type: [String, Array, Object],
        description: 'Vee validate validation rules',
        default: ''
      },
      name: {
        type: String,
        description: 'Input name (used for validation)',
        default: ''
      }
    },
    data() {
      return {
        focused: false,
        isDeleting: false
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
          keydown: this.onKeydown
        };
      },
      slotData() {
        return {
          focused: this.focused,
          error: this.error,
          ...this.listeners
        };
      },
      hasIcon() {
        const { append, prepend } = this.$slots;
        return (
          append !== undefined ||
          prepend !== undefined ||
          this.appendIcon !== undefined ||
          this.prependIcon !== undefined ||
          this.group
        );
      }
    },
    methods: {
      updateValue(evt) {
          const input = evt.target;
          let value = input.value;
          const caretPos = input.selectionStart;
          const endPos = value.length;
          
          // hapus semua nilai non digit
          const priceTrimmed = value.toString().replace(/[^\d]/g, "");
          const priceNumber = Number(priceTrimmed);

          if(priceNumber === 0 && this.isDeleting) {
            value = null;
            this.$emit("input", value);
            return;
          }

          value = this.formatPrice(priceNumber);

          // menentukan posisi caret
          if(caretPos !== endPos) {
              let nextCaretPos = caretPos;
              if(this.isDeleting && priceTrimmed.length % 3 === 0) {
                  nextCaretPos--;
              }
              
              if(!this.isDeleting && priceTrimmed.length % 3 === 1) {
                  nextCaretPos++;
              }
              
              // fokuskan posisi caret
              setTimeout(function(){
                  input.selectionStart = nextCaretPos;
                  input.selectionEnd = nextCaretPos;
                  input.focus();
              }, 10);
          }

          this.$emit("input", value);
      },
      onFocus(evt) {
        this.focused = true;
        this.$emit("focus", evt);
      },
      onBlur(evt) {
        this.focused = false;
        this.$emit("blur", evt);
      },
      onKeydown(evt) {
        const key = evt.keyCode || evt.charCode;
        if(key === 8) {
          this.isDeleting = true;
        } else {
          this.isDeleting = false;
        }
        this.$emit("onkeydown", evt);
      },
      formatPrice(value) {
          if (typeof value !== "number") {
              return value;
          }

          const formatter = new Intl.NumberFormat('id-ID', {
              style: 'currency', 
              currency: 'IDR',
              minimumFractionDigits: 0
          });

          return formatter.format(value);
      },
    }
  };
</script>