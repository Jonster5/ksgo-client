<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Backbutton from '@components/Backbutton.svelte';
    import Createlobby from '@components/Createlobby.svelte';
    import Joinlobby from '@components/Joinlobby.svelte';

    let selectedServerID: string;

    let s_in: Node;
</script>

<main>
    <Backbutton target="title" on:click />
    <div class="server" />

    <Createlobby />
    <div class="divider" />
    <Joinlobby />
</main>

<style lang="scss">
    @import '../styles/vars';

    main {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    .divider {
        width: 10vw;
    }
</style>
