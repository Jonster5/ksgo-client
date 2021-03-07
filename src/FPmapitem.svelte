<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let name: string;
    export let thumb: string;
    export let alt: string;

    const dispatch = createEventDispatcher();

    const click = () => {
        dispatch('select', name);
    };
</script>

<article on:click={click}>
    <h2>{name}</h2>
    <img src={thumb} {alt} />
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
