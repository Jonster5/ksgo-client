<script lang="ts">
    import Backbutton from './Backbutton.svelte';
    import FPGameWindow from './FPGame.svelte';
    import FPmapitem from './FPmapitem.svelte';
    import type { MapItem } from './game/data/maps';
    import { onDestroy, onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import { FP } from './game/fp';
    import SRPItem from './SRPItem.svelte';

    let scene = 0;

    let s: HTMLElement;
    let m_e: HTMLElement;

    export let map: string | MapItem;
    export let assets: {
        maps: Array<string>;
        ships: Array<string>;
        ionthrust: Array<string>;
    };

    let game: FP;

    let showRespawnScreen: boolean;
    let srs: () => void;

    const load = (async () => {})();

    const select = ({ detail }) => {
        game.spawn(detail);
    };

    const init = () => {
        let game = new FP(m_e);
        srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
        game.init(map as MapItem);
        return game;
    };

    onDestroy(() => {
        game.kill();
        srs();
    });
</script>

<main class="outer">
    {#await promise}
        <p>Loading...</p>
    {:then value}
        <!-- promise was fulfilled -->
    {:catch error}
        <!-- promise was rejected -->
    {/await}
</main>

<!-- <Backbutton on:click target="title" />
{#await loadAssets}
    <main class="loading">Loading assets</main>
{:then assets}
    {#if scene === 0}
        <main class="map">
            <h1>Select a map</h1>

            <div class="maplist" bind:this={s} on:wheel|passive={scroll}>
                {#each assets.maps as m}
                    <FPmapitem name={m} on:select={select} />
                {/each}
            </div>
        </main>
    {:else if scene === 1}
        <main class="game">
            <header>KSGO Freeplay</header>

            <article class="ui left" />
            <div>
                {#if showRespawnScreen}
                    <main
                        class="popup"
                        in:fade={{ duration: 100, delay: 1000 }}
                        out:fade={{ duration: 100 }}
                    >
                        <h1>Respawn</h1>
                        <div>
                            {#each assets.ships as name}
                                <SRPItem {name} on:select={select} />
                            {/each}
                        </div>
                    </main>
                {:else}
                    <main bind:this={m_e} on:load={init} />
                {/if}
            </div>
            <article class="ui right" />

            <footer />
        </main>
    {/if}
{/await} -->
<style lang="scss">
    @import './styles/vars.scss';
</style>
