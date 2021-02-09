<script lang="ts">
    export let target: string;

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const click = (screen: string): void => {
        dispatch('click', {
            screen,
        });
    };
</script>

<div on:click={() => click(target)}>Back</div>

<style lang="scss">
    @import 'styles/vars.scss';
    div {
        @include Button;
        display: block;
        position: absolute;
        top: 1vh;
        left: 1vw;
        padding: 0;
        width: 5vw;
        font-size: 1.4vw;
    }
</style>
