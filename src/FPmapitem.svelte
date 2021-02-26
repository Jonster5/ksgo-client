<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { MapItem } from './game/data/maps';

    export let name: string;

    const dispatch = createEventDispatcher();

    let data: MapItem = null;

    const load: Promise<MapItem> = (async () => {
        const res = await fetch(`/data/${name}.json`);
        const json = await res.json();

        if (res.ok) {
            data = json;
            return json;
        } else {
            throw new Error(json);
        }
    })();

    const click = () => {
        dispatch('select', data);
    };
</script>

<article on:click={click}>
    {#await load}
        <h2>Loading...</h2>
    {:then d}
        <h2>{d.name}</h2>
        <img src={d.thumb} alt={d.alt} />
    {:catch}
        <h2>Something went wrong</h2>
    {/await}
</article>

<style lang="scss">
    article {
        min-width: 12vw;
        max-width: 12vw;
        text-align: center;
        margin: 1vw;

        h2 {
            font-family: 'Trispace';
            font-size: 1.5vw;
            width: 100%;
        }

        img {
            width: 100%;
            border-radius: 1vh;
            border: 0.5vh solid white;
        }

        &:hover {
            h2 {
                color: lime;
            }
            img {
                border: 0.5vh solid lime;
            }

            cursor: pointer;
        }
    }
</style>
