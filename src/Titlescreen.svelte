<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const click = (screen: string): void => {
        dispatch('click', {
            screen,
        });
    };
</script>

<main>
    <div class="title">K S G O</div>
    <div class="version">V0.1</div>
    <div class="button" on:click={() => click('join')}>Play Online</div>
    <div class="button" on:click={() => click('freeplay')}>Freeplay</div>
    <div class="button" on:click={() => click('more')}>More Stuff</div>
</main>

<style lang="scss">
    @import 'styles/vars';

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .title {
        font-family: 'Righteous';
        -moz-user-select: none;
        -webkit-user-select: none;
        color: $title;
        font-size: 10vw;
        margin: 4vh 4vw;
        margin-bottom: 1vh;
    }

    .version {
        font-family: 'Trispace';
        -moz-user-select: none;
        -webkit-user-select: none;
        color: $subtitle;
        font-size: 1vw;
        margin: 4vh 4vh;
        margin-top: 0;
    }

    .button {
        @include Button;
        width: 15%;
        margin: 2vh 1vw;
        font-size: 2vw;
    }
</style>
