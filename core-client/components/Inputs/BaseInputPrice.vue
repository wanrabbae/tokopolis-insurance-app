<template>
  <b-form-group>
    <validation-provider v-slot="{errors, valid, invalid, validated}" :rules="rules" :name="name">
      <slot name="label">
        <label v-if="label" :class="labelClasses">
          {{label}}
          <span v-if="required && asterix" class="text-danger">*</span>
        </label>
      </slot>
      <div :class="[
        {'input-group addon-combined': hasCurrency},
        {'focused': focused},
        {'input-group-alternative': alternative},
        {'has-label': label || $slots.label},
        {'is-valid': hasCurrency && valid && validated && successMessage},
        {'is-invalid': hasCurrency && invalid && validated},
        inputGroupClasses
      ]">
        <div v-if="currency || $slots.prepend" class="input-group-prepend">
          <slot name="prepend">
            <span class="input-group-text">
              {{ getCurrencySymbol(currency) }}
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
              {'is-valid': !hasCurrency && valid && validated && successMessage},
              {'is-invalid': !hasCurrency && invalid && validated}, 
              inputClasses
            ]"
            v-on="listeners">
        </slot>
        <slot name="infoBlock"></slot>
      </div>
      <slot name="success">
        <div v-if="valid && validated && successMessage" class="valid-feedback">
          {{successMessage}}
        </div>
      </slot>
      <slot name="error">
        <div v-if="errors[0]" class="d-block invalid-feedback">
          {{ errors[0] }}
        </div>
      </slot>
    </validation-provider>
  </b-form-group>
</template>
<script>
  export default {
    name: 'BaseInputPrice',
    inheritAttrs: false,
    props: {
      required: {
        type: Boolean,
        description: "Whether input is required"
      },
      asterix: {
        type: Boolean,
        description: 'Add asterisk (*) on required field'
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
      currency: {
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
      hasCurrency() {
        const { prepend } = this.$slots;
        return (
          prepend !== undefined ||
          this.currency !== undefined ||
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
          const formatter = new Intl.NumberFormat('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
          });

          if(value === null) {
              return formatter.format(0);
          }

          return formatter.format(Number(value));
      },
      getCurrencySymbol(currency) {
          const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });

          return formatter.format(0).replace(/\d/g, '').trim()
      },
    }
  };
</script>