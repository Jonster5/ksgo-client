<script lang="ts">
    import { onMount } from 'svelte';
    import Backbutton from './Backbutton.svelte';
    import FPGameWindow from './FPGameWindow.svelte';
    import FPmapitem from './FPmapitem.svelte';
    import type { MapItem } from './game/data/maps';

    let scene = 0;

    const maps = ['empty', 'singlesun', 'asteroids', 'starsystem'];
    let map: MapItem;

    let s: HTMLElement;

    const scroll = (e: WheelEvent) => {
        s.scrollLeft -= e.deltaY / 5;
    };

    const select = ({ detail: m }) => {
        map = m;
        scene = 1;
    };

    onMount(() => {
        s.scrollLeft = 0;
    });
</script>

<Backbutton on:click target="title" />

{#if scene === 0}
    <main class="map">
        <h1>Select a map</h1>

        <div class="maplist" bind:this={s} on:wheel|passive={scroll}>
            {#each maps as map}
                <FPmapitem name={map} on:select={select} />
            {/each}
        </div>
    </main>
{:else if scene === 1}
    <main class="game">
        <header>KSGO Freeplay</header>

        <article class="ui left" />
        <div>
            <FPGameWindow {map} />
        </div>
        <article class="ui right" />

        <footer />
    </main>
{/if}

<style lang="scss">
    @import './styles/vars.scss';

    .game {
        display: grid;
        background: #0b0d11;
        grid-template-areas:
            'top top top'
            'left game right'
            'bottom bottom bottom';
        grid-template-rows: 5% auto 5%;
        grid-template-columns: 5% auto 5%;
        width: 100vw;
        height: 100vh;

        font-family: 'Trispace', Courier, monospace;

        .ui {
            display: flex;
        }

        article {
            background: transparent;
        }

        div {
            grid-area: game;
            // background: gold;
        }

        .left {
            grid-area: left;
            // background: transparent;
            flex-direction: column;
        }
        .right {
            grid-area: right;
            // background: transparent;
            flex-direction: column;
        }

        header {
            grid-area: top;
            background: black;

            text-align: center;

            color: gold;
            font-size: 1.5vw;
            padding: auto;
        }
        footer {
            grid-area: bottom;
            background: black;
        }
    }

    .map {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-around;

        align-items: center;

        h1 {
            width: 100%;
            text-align: center;
            font-family: 'Trispace';
            color: $title;
        }

        .maplist {
            display: flex;
            align-items: flex-start;
            // width: 80%;
            // height

            overflow-x: scroll;

            &::-webkit-scrollbar {
                width: 1px;
                height: 1px;
            }

            &::-webkit-scrollbar-track {
                background: black;
            }
            &::-webkit-scrollbar-thumb {
                background: gold;
                border-radius: 1px;
            }
        }
    }
</style>
