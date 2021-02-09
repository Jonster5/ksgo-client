<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Backbutton from './Backbutton.svelte';
    import FPGameWindow from './FPGameWindow.svelte';

    const dispatch = createEventDispatcher();

    const click = (screen: string): void => {
        dispatch('click', {
            screen,
        });
    };
</script>

<main>
    <Backbutton on:click target="title" />

    <header />

    <aside />
    <FPGameWindow
        width={500}
        height={500}
        bg="white"
        border={{ color: 'gold', thickness: 3, type: 'solid', unit: 'px' }}
    />
    <aside />

    <footer />
</main>

<style lang="scss">
</style>
