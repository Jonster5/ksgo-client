<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Backbutton from './Backbutton.svelte';
    import Createlobby from './Createlobby.svelte';
    import Joinlobby from './Joinlobby.svelte';
    import { gserverlist } from './game/sockets/data';

    let selectedServerID: string;

    let s_in: Node;
</script>

<main>
    <Backbutton target="title" on:click />
    <div class="server">
        <label>
            Game Server: <select bind:value={selectedServerID} bind:this={s_in}>
                {#each gserverlist as s}
                    <option value={s.id}>{s.name}</option>
                {/each}
            </select>
        </label>
    </div>

    <Createlobby />
    <div class="divider" />
    <Joinlobby />
</main>

<style lang="scss">
    @import 'styles/vars';

    main {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    .server {
        position: absolute;
        top: 1vh;
        right: 1vw;
        color: $text;
        font-size: 1.2vw;
        font-family: 'Trispace';

        select {
            font-size: 1.2vw;
            border: none;
            outline: none;
            color: black;
        }
    }

    .divider {
        width: 10vw;
    }
</style>
