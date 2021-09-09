<script lang="ts">
	import type { ParsedAssets } from '@data/assetTypes';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import GameOptions from '@comp/singleplayer/GameOptions.svelte';
	import type { InputOptionProperties, OutputOptionProperties } from '@data/gameTypes';
	import Play from '@comp/singleplayer/Play.svelte';

	export let assets: ParsedAssets;

	type SingleplayerScreen = 'game options' | 'game';

	const dispatch = createEventDispatcher();

	let screen: SingleplayerScreen = 'game options';
	const options: InputOptionProperties = {
		mode: writable(assets.modes[0].name),
		map: writable(assets.maps[0].name),
		gravity: writable(10),
		timeLimit: writable(5),
		killLimit: writable(10),
		extra: {},
	};

	let selectedOptions: OutputOptionProperties;

	const start = ({ detail }: { detail: OutputOptionProperties }) => {
		selectedOptions = detail;

		screen = 'game';
	};
</script>

{#if screen === 'game options'}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
	>
		<GameOptions {assets} {...options} on:click on:start={start} />
	</div>
{:else if screen === 'game'}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
	>
		<Play {assets} options={selectedOptions} />
	</div>
{:else}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
	>
		<GameOptions {assets} {...options} on:click on:start={start} />
	</div>
{/if}

<style lang="scss">
	div {
		width: 100%;
		height: 100%;
	}
</style>
