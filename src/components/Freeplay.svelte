<script lang="ts">
	import FPmapitem from '@components/FPmapitem.svelte';
	import UI from '@components/UI.svelte';
	import type { MapItem } from '@data/types';
	import { onDestroy } from 'svelte';
	import { FreeplayGame } from '@classes/game';
	import Srpitem from '@components/Srpitem.svelte';
	import type { ParsedAssets } from '@data/assets';
	import Backbutton from './Backbutton.svelte';

	export let assets: ParsedAssets;

	let gameElement: HTMLElement;

	let game: FreeplayGame;
	let showRespawnScreen: boolean;
	let needsMapSelection = true;
	let UIVisible = false;
	let srs: () => void;

	const selectMap = ({ detail }) => {
		startGame(detail);
		needsMapSelection = false;
	};

	const selectShip = ({ detail }) => {
		game.spawnPlayer(assets.ships.find((s) => s.name === detail));
		UIVisible = true;
	};

	const startGame = (mapName: string) => {
		game = new FreeplayGame(gameElement, assets);
		srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
		game.init(assets.maps.find((m: MapItem) => m.name === mapName));
	};

	onDestroy(() => {
		try {
			game.kill();
			srs();
		} catch {}
	});
</script>

<main class="game" bind:this={gameElement} />

{#if UIVisible}
	<UI {...game.getUIProps()} />
{/if}

{#if needsMapSelection}
	<main class="map">
		<Backbutton target="title" on:click />
		<h1>Select a map</h1>

		<div class="maplist">
			{#each assets.maps as { name, thumb, alt }}
				<FPmapitem {name} {thumb} {alt} on:select={selectMap} />
			{/each}
		</div>
	</main>
{/if}

{#if showRespawnScreen}
	<main class="popup">
		<h1>Respawn</h1>
		<div>
			{#each assets.ships as { name, thumb }}
				<Srpitem {name} {thumb} on:select={selectShip} />
			{/each}
		</div>
	</main>
{/if}

<style lang="scss">
	@import '../styles/vars';

	main {
		position: fixed;
	}

	.game {
		background: black;
	}

	.map {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #000000aa;

		h1 {
			font-size: 3vw;
			color: $title;
			margin-bottom: 10vh;
		}

		div {
			width: 80%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	.popup {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		width: 50vw;
		height: 50vh;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: rgba($color: #000000, $alpha: 0.7);
		h1 {
			color: $title;
		}
		div {
			display: flex;
		}
	}
</style>
