<script lang="ts">
    import FPmapitem from '@components/FPmapitem.svelte';
    import UIRight from '@components/UI/UIRight.svelte';
    import type { MapItem } from '@data/types';
    import { onDestroy, onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';
    import { FP } from '@lib/fp';
    import SRPItem from '@components/SRPItem.svelte';
    import type { ShipStatObject } from '@data/types';
    import { writable } from 'svelte/store';
    import type { ParsedAssets as Assets } from '@data/assets';

    let s: HTMLElement;
    let m_e: HTMLElement;

    export let assets: Assets;

    let game: FP;
    let showRespawnScreen: boolean;
    let needsMapSelection = true;
    let UIVisible = false;
    let srs: () => void;
    let pe: () => void;

    const selectMap = ({ detail }) => {
        gameInit(detail);
        needsMapSelection = false;
    };

    const selectShip = ({ detail }) => {
        game.spawn(assets.ships.find((s) => s.name === detail));
        UIVisible = true;
    };

    const gameInit = (mapName) => {
        game = new FP(m_e, assets);
        srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
        game.init(assets.maps.find((m: MapItem) => m.name === mapName));
    };

    onDestroy(() => {
        game.kill();
        srs();
    });
</script>

<main class="game" bind:this={m_e} />

{#if UIVisible}
    <UIRight energy={game.user.energy} maxEnergy={game.user.maxEnergy} />
{/if}

{#if needsMapSelection}
    <main class="map">
        <h1>Select a map</h1>

        <div class="maplist" bind:this={s}>
            {#each assets.maps as { name, thumb, alt }}
                <FPmapitem {name} {thumb} {alt} on:select={selectMap} />
            {/each}
        </div>
    </main>
{/if}

{#if showRespawnScreen}
    <main class="popup">
        <h1>Respawn</h1>
        <div>
            {#each assets.ships as { name, thumb }}
                <SRPItem {name} {thumb} on:select={selectShip} />
            {/each}
        </div>
    </main>
{/if}

<style lang="scss">
    @import '../styles/vars';

    main {
        position: fixed;
    }

    .game {
        background: black;
    }

    .map {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #000000aa;

        h1 {
            font-size: 3vw;
            color: $title;
            margin-bottom: 10vh;
        }

        div {
            display: flex;
            justify-content: center;
        }
    }

    .popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        width: 50vw;
        height: 50vh;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba($color: #000000, $alpha: 0.7);
        h1 {
            color: $title;
        }
        div {
            display: flex;
        }
    }
</style>
