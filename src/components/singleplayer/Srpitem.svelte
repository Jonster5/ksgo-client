<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let thumb: HTMLImageElement;

	const dispatch = createEventDispatcher();

	const click = () => {
		dispatch('select', name);
	};
</script>

<article on:click={click}>
	<h3>{name}</h3>
	<img src={thumb.src} alt={name} />
</article>

<style lang="scss">
	article {
		min-width: 6vw;
		max-width: 6vw;
		text-align: center;
		margin: 1vw;

		h3 {
			font-family: 'Trispace';
			font-size: 1.1vw;
			width: 100%;
		}

		img {
			width: 100%;
			border-radius: 1vh;
			border: 0.5vh solid white;
		}

		&:hover {
			h3 {
				color: lime;
			}
			img {
				border: 0.5vh solid lime;
			}

			cursor: pointer;
		}
	}
</style>
