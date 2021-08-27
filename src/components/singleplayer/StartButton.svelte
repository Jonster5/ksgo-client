<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const start = (): void => {
		dispatch('start');
	};
</script>

<div on:click={start}>Start</div>

<style lang="scss">
	@import '../../styles/vars';

	div {
		@include Button;
		display: block;
		position: absolute;
		top: 0.6vh;
		right: 0.6vh;
		padding: 0;
		width: 5vw;
		font-size: 1.4vw;
		z-index: 9999;
	}
</style>
