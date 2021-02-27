<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { MapItem } from './game/data/maps';
    import { FP } from './game/fp';
    import SRPItem from './SRPItem.svelte';

    export let map: MapItem;

    let m_e: HTMLElement;
    let game: FP;

    let showRespawnScreen: boolean;
    let srs: () => void;

    const shipNames = ['fighter', 'frigate'];

    const select = ({ detail }) => {
        game.spawn(detail);
    };

    onMount(() => {
        game = new FP(m_e);
        srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
        game.init(map);
    });

    onDestroy(() => {
        game.kill();
        srs();
    });
</script>

{#if showRespawnScreen}
    <main class="popup">
        <h1>Respawn</h1>
        <div>
            {#each shipNames as name}
                <SRPItem {name} on:select={select} />
            {/each}
        </div>
    </main>
{/if}

<main bind:this={m_e} />

<style lang="scss">
    @import 'styles/vars';

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
