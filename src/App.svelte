<script lang="ts">
    import Titlescreen from './Titlescreen.svelte';
    import Freeplay from './Freeplay.svelte';
    import Morestuff from './Morestuff.svelte';
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import type { MapItem } from './game/data/maps';
    import type { ShipStatObject } from './game/data/ships';
    import Multiplayer from './Multiplayer.svelte';

    let screen = 'title';

    const click = ({ detail }) => {
        screen = detail.screen;
    };

    interface Assets {
        maps: MapItem[];
        ships: ShipStatObject[];
        ionthrust: string[];
    }

    const getAssets = async () => {
        const res = await fetch('/data/assets.json');

        if (!res.ok) throw new Error(res.statusText);

        const json = await res.json();

        const ret: Assets = {
            maps: await Promise.all(
                json.maps.map(
                    (m: string): Promise<MapItem> => fetch(`/data/${m}.json`).then((r) => r.json())
                )
            ),
            ships: await Promise.all(
                json.ships.map(
                    (s: string): Promise<ShipStatObject> =>
                        fetch(`/data/${s}.json`).then((r) => r.json())
                )
            ),
            ionthrust: json.ionthrust.map((t: string) => {
                const i = new Image();
                i.src = t;
                return i;
            }),
        };

        return ret;
    };
</script>

{#await getAssets()}
    <main>
        <h2>Loading...</h2>
    </main>
{:then assets}
    {#if screen === 'title'}
        <div
            in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: 100 }}
            out:fly={{ easing: cubicOut, duration: 250, y: 100 }}
        >
            <Titlescreen on:click={click} />
        </div>
    {:else if screen === 'play'}
        <div
            in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
            out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
        >
            <Freeplay on:click={click} {assets} />
        </div>
    {:else if screen === 'online'}
        <div
            in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
            out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
        >
            <Multiplayer on:click={click} />
        </div>
    {:else if screen === 'more'}
        <Morestuff />
    {:else}
        <Titlescreen on:click={click} />
    {/if}
{:catch error}
    <main>
        <h2>Hmmmm, something went wrong with loading assets: {error}</h2>
    </main>
{/await}

<style lang="scss">
    @import './styles/vars.scss';

    div {
        width: 100%;
        height: 100%;
        // transform:;
    }

    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h2 {
            text-align: center;
            color: $title;
        }
    }
</style>
