<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { FP } from './game/fp';

    export let m: string;

    let m_e: HTMLElement;

    let game: FP;

    async function p() {}

    const load = async () => {
        game = new FP(m_e);

        const mapres = await fetch(`/data/${m}.json`);
        const map = await mapres.json();

        game.init(map);
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
