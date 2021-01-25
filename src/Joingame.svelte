<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Createlobby from './join/Createlobby.svelte';
    import Joinlobby from './join/Joinlobby.svelte';
    import { client, serverdata, sockets, serverListID } from './modules/data';
    // import { SWSmessage, SWSopen } from './modules/sockets';

    const dispatch = createEventDispatcher();

    $: sda = Array.from(serverdata);

    let selectedServerID: string;

    const click = (screen: string): void => {
        dispatch('click', {
            screen,
        });
    };
</script>

<main>
    <div class="backbutton" on:click={() => click('title')}>Back</div>
    <div class="server">
        <label>
            Game Server: <select bind:value={selectedServerID}>
                {#each sda as s}
                    <option value={s[0]}>{s[1].name}</option>
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

    .backbutton {
        @include Button;
        display: block;
        position: absolute;
        top: 1vh;
        left: 1vw;
        padding: 0;
        width: 5vw;
        font-size: 1.4vw;
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
