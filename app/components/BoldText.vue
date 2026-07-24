<template>
    <div class="bold__text">
        <span class="bold" :class="boldClass" :style="boldStyle">{{ bold.text }}</span>
        <span class="normal" :class="normalClass" :style="normalStyle">{{ normal.text }}</span>
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

/**
 * The two content systems supply these differently: the legacy schemas pass
 * helper class names ("primary-color", "fontSizeXXXL"), while the page
 * builder's colour/size fields produce real CSS values ("#8AA73B", "2rem").
 * Anything that looks like a CSS value is applied as an inline style, anything
 * else as a class — so both keep working.
 *
 * Previously these were always applied as classes, so a value like "#000000"
 * matched no rule and the colour/size fields silently did nothing.
 */
const isCssColor = (v?: string) =>
    !!v && (v.startsWith("#") || /^(rgb|hsl)a?\(/i.test(v));

const isCssLength = (v?: string) =>
    !!v && /^[\d.]+(px|rem|em|%|vw|vh|pt)$/i.test(v);

export default defineComponent({
    props: {
        bold: {
            type: Object as () => TextStyle,
            required: false,
            default: () => ({ text: "" })
        },
        normal: {
            type: Object as () => TextStyle,
            required: false,
            default: () => ({ text: "" })
        }
    },
    computed: {
        boldStyle(): Record<string, string> {
            return this.styleFor(this.bold);
        },
        normalStyle(): Record<string, string> {
            return this.styleFor(this.normal);
        },
        boldClass(): string[] {
            return this.classFor(this.bold);
        },
        normalClass(): string[] {
            return this.classFor(this.normal);
        }
    },
    methods: {
        styleFor(part?: TextStyle): Record<string, string> {
            const style: Record<string, string> = {};
            if (isCssColor(part?.color)) style.color = part!.color as string;
            if (isCssLength(part?.fontSize)) style.fontSize = part!.fontSize as string;
            if (part?.weight) style.fontWeight = String(part.weight);
            return style;
        },
        classFor(part?: TextStyle): string[] {
            const classes: string[] = [];
            if (part?.color && !isCssColor(part.color)) classes.push(part.color);
            if (part?.fontSize && !isCssLength(part.fontSize)) classes.push(part.fontSize);
            return classes;
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
