<script lang="ts">
    import { onDestroy, onMount } from 'svelte';

    import { FP } from './game/fp';

    let m_e: HTMLElement;

    let game: FP;

    const load = () => {
        game = new FP(m_e);
        game.init('starsystem');
    };

    onMount(load);
    onDestroy(() => {
        game.kill();
    });
</script>

<main bind:this={m_e} />

<style lang="scss">
    // main {
    //     // border: 2px solid white;
    // }
</style>
