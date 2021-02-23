<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let title: string;
    export let bodytext: string;

    export let buttons: Array<{
        title: string;
        value: string;
    }>;

    const dispatch = createEventDispatcher();

    const click = (value: string) => dispatch('click', { value });
</script>

<main>
    <header>{title}</header>
    <p>{bodytext}</p>

    {#each buttons as { title, value }}
        <button on:click={() => click(value)}>{title}</button>
    {/each}
</main>

<style lang="scss">
    main {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
