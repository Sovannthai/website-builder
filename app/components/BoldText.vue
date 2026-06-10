<template>
    <div :class="['bold__text', bold.color, bold.fontSize]">
        <span class="bold">{{ bold.text }}</span>
        <span class="normal">{{ normal.text }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export interface TextStyle {
    text: string;
    weight?: number;
    color?: string;
    fontSize?: string;
}

export default defineComponent({
    props: {
        bold: {
            type: Object as () => TextStyle,
            required: true
        },
        normal: {
            type: Object as () => TextStyle,
            required: true
        }
    }
})
</script>
<style scoped lang="scss">
    .bold__text {
        text-transform: uppercase;
        font-size: var(--font-size-md);
    }
    .fontSizeXXXL {
        font-size: var(--font-size-xxxl);
    }
    .bold {
        font-weight: 600;
        margin-right: 5px;
    }
    .normal {
        font-weight: 300;
    }
    .primary-color {
        color: $color-primary;
    }
    .secondary-color {
        color: $color-secondary;
    }
    .color-white {
        color: $color-white;
    }
</style>
