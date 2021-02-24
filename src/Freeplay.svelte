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

    <header>KSGO Freeplay</header>

    <article class="ui left" />
    <div>
        <FPGameWindow m="starsystem" />
    </div>
    <article class="ui right" />

    <footer />
</main>

<style lang="scss">
    @import './styles/vars.scss';

    main {
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
    }

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
</style>
