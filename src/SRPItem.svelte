<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { ShipStatObject } from './game/data/ships';

    export let name: string;

    const dispatch = createEventDispatcher();

    let data: ShipStatObject = null;

    const load: Promise<ShipStatObject> = (async () => {
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
        <h3>Loading</h3>
        <img src="" alt="Loading" />
    {:then ship}
        <h3>{ship.name}</h3>
        <img src={ship.thumb} alt={ship.name} />
    {:catch}
        <h3>Something went wrong</h3>
    {/await}
</article>

<style lang="scss">
    article {
        min-width: 6vw;
        max-width: 6vw;
        text-align: center;
        margin: 1vw;

        h3 {
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
            h3 {
                color: lime;
            }
            img {
                border: 0.5vh solid lime;
            }

            cursor: pointer;
        }
    }
</style>
