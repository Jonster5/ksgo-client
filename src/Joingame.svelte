<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Createlobby from './join/Createlobby.svelte';
    import Joinlobby from './join/Joinlobby.svelte';
    import { client, gserverlist, sockets } from './modules/data';

    import { SWSConnect } from './modules/sockets';

    const dispatch = createEventDispatcher();

    let selectedServerID: string;

    let s_in: Node;
    let s_l: MutationObserver;

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
