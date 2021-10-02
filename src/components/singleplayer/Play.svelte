<script lang="ts">
	import UI from './UI.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Srpitem from './Srpitem.svelte';
	import type { ParsedAssets } from '@data/assetTypes';
	import * as Games from '@classes/game';
	import type { OutputOptionProperties } from '@data/gameTypes';

	export let assets: ParsedAssets;
	export let options: OutputOptionProperties;

	const GAME = Games[options.mode.gameClassName]!;

	let game: any;
	let gameElement: HTMLElement;
	let showRespawnScreen: boolean;
	let UIVisible = false;
	let srs: () => void;

	const selectShip = ({ detail }) => {
		game.spawnPlayer(assets.ships.find((s) => s.name === detail));
		UIVisible = true;
	};

	onMount(() => {
		game = new GAME(gameElement, assets, options);
		srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
	});

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
	@import '../../styles/vars';

	main {
		position: fixed;
	}

	.game {
		background: black;
		width: 100%;
		height: 100%;
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
