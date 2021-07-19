<script lang="ts">
	export let target: string;
	export let eventName: string = 'click';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const click = (screen: string): void => {
		dispatch(eventName, {
			screen,
		});
	};
</script>

<div on:click={() => click(target)}>Next</div>

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
	}
</style>
