<script lang="ts">
	import Joingame from './Joingame.svelte';
	import Titlescreen from './Titlescreen.svelte';
	import Freeplay from './Freeplay.svelte';
	import Morestuff from './Morestuff.svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let screen = 'title';

	const click = ({ detail }) => {
		screen = detail.screen;
	};
</script>

{#if screen === 'title'}
	<div
		in:fly={{ easing: quintOut, delay: 500, duration: 500, y: 100 }}
		out:fly={{ easing: quintOut, duration: 500, y: 100 }}
	>
		<Titlescreen on:click={click} />
	</div>
{:else if screen === 'join'}
	<div
		in:fly={{ easing: quintOut, delay: 500, duration: 500, y: -100 }}
		out:fly={{ easing: quintOut, duration: 500, y: -100 }}
	>
		<Joingame on:click={click} />
	</div>
{:else if screen === 'freeplay'}
	<div
		in:fly={{ easing: quintOut, delay: 500, duration: 500, y: -100 }}
		out:fly={{ easing: quintOut, duration: 500, y: -100 }}
	>
		<Freeplay />
	</div>
{:else if screen === 'more'}
	<Morestuff />
{:else}
	<Titlescreen on:click={click} />
{/if}

<style lang="scss">
	div {
		width: 100%;
		height: 100%;
		// transform:;
	}
</style>
