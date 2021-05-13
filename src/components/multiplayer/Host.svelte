<script lang="ts">
	import type { ParsedAssets } from '@data/assets';
	import type { GameOptions, MapItem } from '@data/types';
	import { HostGame } from '@classes/game';
	import { onDestroy, onMount } from 'svelte';
	import UI from '@components/UI.svelte';
	import SrpItem from '@components/Srpitem.svelte';

	export let options: GameOptions;
	export let assets: ParsedAssets;

	let gameElement: HTMLElement;

	let game: HostGame;
	let showRespawnScreen: boolean;
	let UIVisible = false;
	let srs: () => void;

	const selectShip = ({ detail }) => {
		game.spawnPlayer(assets.ships.find((s) => s.name === detail));
		UIVisible = true;
	};

	onMount(() => {
		game = new HostGame(gameElement, assets, options);
		srs = game.needsShipRespawn.subscribe((v) => (showRespawnScreen = v));
		game.init(assets.maps.find((m: MapItem) => m.name === options.map));
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
				<SrpItem {name} {thumb} on:select={selectShip} />
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
