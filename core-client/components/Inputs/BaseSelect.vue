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
        'input-group',
        {'focused': focused},
        {'has-label': label || $slots.label},
        inputGroupClasses
      ]">
        <div v-if="prependIcon || $slots.prepend" class="input-group-prepend">
        <span class="input-group-text">
          <slot name="prepend">
            <i :class="prependIcon"></i>
          </slot>
        </span>
        </div>
        <slot v-bind="slotData">
          <select 
              :value="value"
              v-bind="$attrs"
              :valid="valid"
              :required="required"
              class="custom-select"
              :class="[{'is-valid': valid && validated && successMessage}, {'is-invalid': invalid && validated}, inputClasses]"
              v-on="listeners"
          >
            <option 
              v-for="(option, id) in options" 
              :key="id" 
              :value="typeof option === 'string' ? option : option.value" 
              :disabled="typeof option === 'string' ? false : option.disabled"
            >
              {{ typeof option === 'string' ? option : option.text }}
            </option>
          </select>
        </slot>
        <div v-if="appendIcon || $slots.append" class="input-group-append">
          <span class="input-group-text">
              <slot name="append">
                  <i :class="appendIcon"></i>
              </slot>
          </span>
        </div>
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
    name: 'BaseSelect',
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
      options: {
        type: [Array, Object],
        description: "Input options"
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
      appendIcon: {
        type: String,
        description: "Append icon (right)"
      },
      prependIcon: {
        type: String,
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
        focused: false
      };
    },
    computed: {
      listeners() {
        return {
          ...this.$listeners,
          input: this.updateValue,
          focus: this.onFocus,
          blur: this.onBlur,
          change: this.onChange
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
      },
      onChange(evt) {
        this.$emit("change", evt);
      }
    }
  };
</script>
<style>
</style>
