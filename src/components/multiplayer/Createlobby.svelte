<script lang="ts">
	import type { ParsedAssets } from '@data/assets';
	import type { GameOptions } from '@data/types';
	import { createEventDispatcher } from 'svelte';

	export let assets: ParsedAssets;

	const dispatch = createEventDispatcher();

	let options: GameOptions = {
		players: 10,
		map: 'Empty Map',
		private: false,
	};

	const createLobby = (o: GameOptions) => {
		dispatch('select', o);
	};
</script>

<main>
	<div class="title">Create Lobby</div>
	<div class="label">Players</div>
	<div class="item">
		<input type="range" bind:value={options.players} min="2" max="10" />
		<input
			type="number"
			bind:value={options.players}
			min="2"
			max="10"
			readonly
		/>
	</div>
	<div class="label">Map</div>
	<div class="item">
		<select bind:value={options.map}>
			{#each assets.maps as { name }}
				<option value={name}>{name}</option>
			{/each}
		</select>
		<img
			loading="lazy"
			src={assets.maps.find((m) => m.name === options.map)?.thumb}
			width="100"
			height="100"
			alt={assets.maps.find((m) => m.name === options.map)?.alt}
		/>
	</div>
	<div class="label">Lobby Type</div>
	<div class="item" style="flex-direction: column;">
		<label>
			<input
				type="checkbox"
				name="privateorpublic"
				id="public"
				bind:checked={options.private}
			/>Private Game?</label
		>
	</div>
	<div id="submit" class="button" on:click={() => createLobby(options)}>
		Create Lobby
	</div>
</main>

<style lang="scss">
	@import '../../styles/vars';

	main {
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

			&::-webkit-outer-spin-button,
			&::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}

			&[type='number'] {
				width: 1.5vw;
				text-align: center;
				font-size: 1.1vw;
				border: none;
				background: none;
				-moz-appearance: textfield;
				border-bottom: 0.2vh solid white;
			}

			&[type='range'] {
				margin: -0.5vh 1vw;
				width: 60%;
			}

			&:hover {
				cursor: pointer;
			}
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
		@include Button;
		width: 40%;
		margin: auto auto;
	}
</style>
