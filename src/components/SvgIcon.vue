<template>
  <svg
    :width="sizeValue"
    :height="sizeValue"
    :viewBox="viewboxValue"
    :style="styles"
  >
    <path :d="path" :fill="fill" />
  </svg>
</template>

<script>
const types = {
  mdi: {
    size: 12,
    viewbox: "0 0 24 24",
  },
  "simple-icons": {
    size: 24,
    viewbox: "0 0 24 24",
  },
  default: {
    size: 0,
    viewbox: "0 0 0 0",
  },
};

export default {
  name: "SvgIcon",

  props: {
    type: {
      type: String,
      default: "mdi",
    },
    path: { type: String, required: true },
    size: { type: [String, Number], default: 24 },
    //fill default to gray
    fill: { type: String, default: "black" },
    viewbox: String,
    flip: {
      type: String,
      validator: (value) =>
        ["horizontal", "vertical", "both", "none"].includes(value),
    },
    rotate: { type: Number, default: 0 },
  },

  computed: {
    styles() {
      return {
        "--sx": ["both", "horizontal"].includes(this.flip) ? "-1" : "1",
        "--sy": ["both", "vertical"].includes(this.flip) ? "-1" : "1",
        "--r": isNaN(this.rotate) ? this.rotate : this.rotate + "deg",
      };
    },

    defaults() {
      return types[this.type] || types.default;
    },

    sizeValue() {
      return this.size || this.defaults.size;
    },

    viewboxValue() {
      return this.viewbox || this.defaults.viewbox;
    },
  },
};
</script>

<style scoped>
svg {
  transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
}
</style>
