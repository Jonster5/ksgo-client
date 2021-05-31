<script lang="ts">
	/**
	 * 420 (Blaze it)
	 * - Charle
	 */
	import Titlescreen from '@components/Titlescreen.svelte';
	import Freeplay from '@components/Freeplay.svelte';
	import Morestuff from '@components/Morestuff.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { MapItem, ShipStatObject } from '@data/types';
	import Multiplayer from '@components/Multiplayer.svelte';
	import type { ParsedAssets } from '@data/assets';
	import { GET_KSGO_FIREBASE } from '../lib/data/multiplayer';
	import config from '@/credentials.json';

	let screen = 'title';

	const FS = GET_KSGO_FIREBASE(config);

	const click = ({ detail }) => {
		screen = detail.screen;
	};

	const getAssets = async (): Promise<ParsedAssets> => {
		const res = await fetch('/data/assets.json');

		if (!res.ok) throw new Error(res.statusText);

		const json = await res.json();

		const ret: ParsedAssets = {
			maps: await Promise.all(
				json.maps.map(
					(m: string): Promise<MapItem> =>
						fetch(`/data/${m}.json`).then((r) => r.json())
				)
			),
			ships: await Promise.all(
				json.ships.map(
					(s: string): Promise<ShipStatObject> =>
						fetch(`/data/${s}.json`).then((r) => r.json())
				)
			),
			ionthrust: json.ionthrust.map((t: string) => {
				const i = new Image();
				i.src = t;
				return i;
			}),
			gamebg: json.gamebg.map((b: string) => {
				const i = new Image(500, 500);
				i.src = b;
				return i;
			}),
		};

		return ret;
	};
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

{#await getAssets()}
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
			<Freeplay on:click={click} {assets} />
		</div>
	{:else if screen === 'online'}
		<div
			in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
			out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
		>
			<Multiplayer on:click={click} {assets} {FS} />
		</div>
	{:else if screen === 'more'}
		<Morestuff />
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
