<script lang="ts">
    import type { Writable } from 'svelte/store';

    export let energy: Writable<number>;
    export let maxEnergy: number = 0;
</script>

<main>
    <div class="energyDisplay">
        <div style={`height: ${100 - ($energy / maxEnergy) * 100}%`} />
    </div>
    <div class="hullDisplay">
        <div style={`height: ${100 - 50}%`} />
    </div>
</main>

<style lang="scss">
    @import '../../styles/vars';

    main {
        position: absolute;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        background-color: #000000aa;

        right: 1vw;
        bottom: 5vh;
        height: 50vh;
        width: 5vw;

        div {
            div {
                transition-duration: 100ms;
            }
        }
    }

    .energyDisplay {
        background-color: gold;
        width: 15%;
        height: 90%;
        div {
            background-color: $UIBarBG;
            width: 100%;
        }
    }

    .hullDisplay {
        background-color: blue;
        width: 15%;
        height: 90%;
        div {
            background-color: $UIBarBG;
            width: 100%;
        }
    }
</style>
