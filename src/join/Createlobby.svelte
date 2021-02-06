<script lang="ts">
    let playercount = 10;
</script>

<div class="c">
    <div class="title">Create Lobby</div>
    <div class="label">Players</div>
    <div class="item">
        <input type="range" bind:value={playercount} min="2" max="10" />
        <input type="number" bind:value={playercount} min="2" max="10" />
    </div>
    <div class="label">Map</div>
    <div class="item">
        <select id="mapoption">
            <option value="empty">Empty Map</option>
            <option value="singlesun">Single Sun</option>
        </select>
        <img
            loading="lazy"
            id="mapoptionthumb"
            src="images/empty_map_thumb.png"
            width="960"
            height="720"
            alt="empty starfield"
        />
    </div>
    <div class="label">Lobby Type</div>
    <div class="item" style="flex-direction: column;">
        <label>
            <input type="radio" name="privateorpublic" id="public" value="pub" checked />Public Game</label
        >

        <label>
            <input type="radio" name="privateorpublic" id="private" value="pri" />Private Game</label
        >
    </div>
    <div id="submit" class="button">Create Lobby</div>
</div>

<style lang="scss">
    @import '../styles/vars';

    .c {
        width: 25vw;
        height: 80vh;
    }

    .title {
        width: 100%;
        color: $title;
        text-align: center;
        font-family: 'Righteous';
        font-size: 2vw;
        margin: 2vh auto 5vh auto;
    }

    .item {
        display: flex;
        justify-content: space-evenly;
        font-size: 1.2vw;
        margin: 1vh 10% 4vh 10%;

        label {
            color: white;
            font-family: 'Trispace';

            // span {
            //     width: 1vw;
            //     text-align: center;
            // }
        }

        input {
            outline: none;
            margin: 1vh 2vw;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type='number'] {
            width: 1.5vw;
            text-align: center;
            border: none;
            background: none;
            -moz-appearance: textfield;
            border-bottom: 2px solid white;
        }

        input[type='range'] {
            margin: -0.5vh 1vw;
            width: 60%;
        }

        img {
            width: 40%;
            height: auto;
            margin: auto;
            border: 2px solid white;

            text-align: center;
            color: $subtitle;
        }

        select {
            width: 40%;
            margin: auto;
            border: none;
            outline: none;
            font-size: 1.2vw;

            color: black;

            option {
                border: none;
                outline: none;
                color: black;
            }
        }
    }

    .label {
        color: $subtitle;
        font-family: 'Trispace';
        font-size: 1.2vw;
        width: 100%;
        text-align: center;
        margin: 1vh auto;
    }

    .button {
        margin: 2vh auto;
        width: 40%;
        font-size: 1vw;
        font-family: 'Trispace';
        color: gold;
        border: 0.4vh solid white;
        background: black;
        border-radius: 2px;
        text-align: center;
        padding: 0.8vh 0;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
</style>
