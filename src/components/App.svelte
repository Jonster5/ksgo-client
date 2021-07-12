<script lang="ts">
	/**
	 * 420 (Blaze it)
	 * - Charle
	 */
	import Titlescreen from './titlescreen/Titlescreen.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import { GET_KSGO_FIREBASE } from '@data/multiplayerTypes';
	import config from 'credentials.json';
	import Singleplayer from './singleplayer/Singleplayer.svelte';

	import { LoadAssets } from '@classes/assets';

	let screen = 'title';

	const db = GET_KSGO_FIREBASE(config);

	const click = ({ detail }) => {
		screen = detail.screen;
	};
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

{#await LoadAssets('/data/assets.json')}
	<main>
		<h2>Loading...</h2>
	</main>
{:then assets}
	{#if screen === 'title'}
		<div
			in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: 100 }}
			out:fly={{ easing: cubicOut, duration: 250, y: 100 }}
		>
			<Titlescreen on:click={click} />
		</div>
	{:else if screen === 'play'}
		<div
			in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
			out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
		>
			<Singleplayer on:click={click} {assets} />
		</div>
	{:else if screen === 'online'}
		<div
			in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
			out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
		/>
	{:else}
		<Titlescreen on:click={click} />
	{/if}
{:catch error}
	<main>
		<h2>Hmmmm, something went wrong with loading assets: {error}</h2>
	</main>
{/await}

<style lang="scss">
	@import '../styles/vars';

	div {
		width: 100%;
		height: 100%;
		// transform:;
	}

	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		h2 {
			text-align: center;
			color: $title;
		}
	}
</style>
