<template>
  <b-form-group>
    <validation-provider v-slot="{errors, valid, invalid, validated}" :rules="rules" :name="name">
      <slot name="label">
        <label v-if="label" :class="labelClasses">
          {{label}}
        </label>
      </slot>
      <div :class="[
        'input-group',
        {'focused': focused},
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
        <div v-if="prefixText || $slots.prepend" class="input-group-prepend">
          <slot name="prepend">
            <span class="input-group-text">
              {{prefixText}}
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
  export default {
    name: 'BaseInput',
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
        type: String,
        description: "Append icon (right)"
      },
      prependIcon: {
        type: String,
        description: "Prepend icon (left)"
      },
      prefixText: {
        type: String,
        description: "Prefix text (left)"
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
        focused: false
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur
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
        const value = evt.target.value;
        this.$emit("input", value);
      },
      onFocus(evt) {
        this.focused = true;
        this.$emit("focus", evt);
      },
      onBlur(evt) {
        this.focused = false;
        this.$emit("blur", evt);
      }
    }
  };
</script>
<style>
</style>
