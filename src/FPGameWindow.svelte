<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { MapItem } from './game/data/maps';
    import { FP } from './game/fp';

    export let map: MapItem;

    let m_e: HTMLElement;
    let game: FP;

    onMount(() => {
        game = new FP(m_e);
        game.init(map);
    });
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
