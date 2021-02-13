<script lang="ts">
    import { onMount } from 'svelte';

    import { FP } from './game/fp';

    let m_e: HTMLElement;

    let game: FP;

    const load = () => {
        console.log('yes');
        game = new FP(m_e, 'empty');
    };

    onMount(load);
</script>

<main bind:this={m_e} />

<style lang="scss">
    // main {
    //     // border: 2px solid white;
    // }
</style>
