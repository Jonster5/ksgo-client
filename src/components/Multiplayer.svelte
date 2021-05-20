<script lang="ts">
	import Backbutton from '@components/Backbutton.svelte';
	import Createlobby from '@components/multiplayer/Createlobby.svelte';
	import Joinlobby from '@components/multiplayer/Joinlobby.svelte';
	import type { ParsedAssets } from '@data/assets';
	import type { GameOptions } from '@data/types';
	import type { FireStore } from '../lib/data/multiplayer';
	import Host from './multiplayer/Host.svelte';

	export let assets: ParsedAssets;

	export let FS: FireStore;

	enum Screen {
		setup,
		host,
		client,
	}

	let screen: Screen = Screen.setup;

	let options: GameOptions;

	const create = ({ detail: o }: { detail: GameOptions }) => {
		options = o;

		screen = Screen.host;
	};
</script>

<main>
	{#if screen === Screen.setup}
		<Backbutton target="title" on:click />

		<Createlobby {assets} on:select={create} />
		<Joinlobby {FS} />
	{:else if screen === Screen.host}
		<Host {options} {assets} {FS} />
	{/if}
</main>

<style lang="scss">
	@import '../styles/vars';

	main {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
</style>
