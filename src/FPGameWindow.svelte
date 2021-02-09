<script lang="ts">
    import { FP } from './game/fp';

    let m_e: HTMLElement;

    const game = new FP(m_e, 'empty');
</script>

<main bind:this={m_e} />

<style lang="scss">
</style>
