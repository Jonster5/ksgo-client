<script lang="ts">
    import { FP } from './lib/fp';

    export let width: number;
    export let height: number;
    export let bg: string;
    export let border: {
        thickness: number;
        unit: string;
        color: string;
        type: string;
    };

    let m_e: HTMLElement;
    let c_e: HTMLCanvasElement;

    const game = new FP(m_e, 'empty');

    console.log(width, height, border, bg);
</script>

<main bind:this={m_e} />

<style lang="scss">
</style>
