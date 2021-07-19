<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let description: string;

	const dispatch = createEventDispatcher();

	const select = () => {
		dispatch('select', name);
	};
</script>

<div on:click={select}>
	<h3>{name}</h3>
	<p>{description}</p>
</div>

<style lang="scss">
	@import '../../styles/vars';

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: left;
		-moz-user-select: none;
		user-select: none;

		width: 100%;

		margin: 1vh 0;

		&:hover {
			cursor: pointer;
		}

		h3 {
			margin: 2vh 1vw;
			color: white;
			font-family: 'Trispace', monospace;
			text-shadow: 0 0 1vh white;
		}

		p {
			margin: 2vh 1vw;
			color: grey;
			font-family: 'Crete Round', sans-serif;
		}
	}
</style>
