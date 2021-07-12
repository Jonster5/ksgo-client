<script lang="ts">
	import type { ParsedAssets } from '@data/assets';
	import GameMode from './GameMode.svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	export let assets: ParsedAssets;

	const dispatch = createEventDispatcher();

	type SingleplayerScreen = 'game mode' | 'game options' | 'game';

	let screen: SingleplayerScreen = 'game mode';

	const click = ({ detail }) => {
		screen = detail.screen;
	};
</script>

{#if screen === 'game mode'}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: 100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: 100 }}
	>
		<GameMode on:click {assets} />
	</div>
{:else if screen === 'game options'}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
	/>
{:else if screen === 'game'}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: -100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: -100 }}
	/>
{:else}
	<div
		in:fly={{ easing: cubicOut, delay: 250, duration: 250, y: 100 }}
		out:fly={{ easing: cubicOut, duration: 250, y: 100 }}
	>
		<GameMode on:click {assets} />
	</div>
{/if}

<style lang="scss">
	div {
		width: 100%;
		height: 100%;
	}
</style>
