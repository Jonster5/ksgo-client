<script lang="ts">
    import Joingame from './Joingame.svelte';
    import Titlescreen from './Titlescreen.svelte';
    import Freeplay from './Freeplay.svelte';
    import Morestuff from './Morestuff.svelte';
    import { fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let screen = 'title';

    const click = ({ detail }) => {
        screen = detail.screen;
    };
</script>

{#if screen === 'title'}
    <div
        in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: 100 }}
        out:fly={{ easing: cubicOut, duration: 250, y: 100 }}
    >
        <Titlescreen on:click={click} />
    </div>
{:else if screen === 'join'}
    <div
        in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
        out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
    >
        <Joingame on:click={click} />
    </div>
{:else if screen === 'freeplay'}
    <div
        in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
        out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
    >
        <Freeplay on:click={click} />
    </div>
{:else if screen === 'more'}
    <Morestuff />
{:else}
    <Titlescreen on:click={click} />
{/if}

<style lang="scss">
    header {
        display: flex;
        position: fixed;

        justify-content: center;
        align-items: center;

        background-color: #000000;
        width: 100%;
        height: 40%;

        text-align: center;
        font-size: 5vw;
        font-family: 'Trispace', monospace;
        font-weight: 900;

        strong {
            color: skyblue;
        }
    }
    div {
        width: 100%;
        height: 100%;
        // transform:;
    }
</style>
