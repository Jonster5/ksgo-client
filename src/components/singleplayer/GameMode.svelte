<script lang="ts">
	import GMCard from './GMCard.svelte';

	import type { ParsedAssets } from '@data/assetTypes';
	import Backbutton from '@comp/general/Backbutton.svelte';
	import type { Writable } from 'svelte/store';
	import Nextbutton from '@comp/general/Nextbutton.svelte';
	import { onMount } from 'svelte';

	export let assets: ParsedAssets;
	export let selectedMap: Writable<string>;

	let isrc: string;

	const select = ({ detail: name }) => {
		$selectedMap = name;

		isrc = assets.modes.find((m) => m.name === name)!.thumb.src;
	};

	onMount(() => {
		select({ detail: 'Peaceful' });
	});
</script>

<main>
	<Backbutton target="title" on:click />
	<Nextbutton target="game options" on:click />
	<article class="imgdisplay">
		<header>{$selectedMap}</header>
		<img src={isrc} alt="" />
	</article>
	<article class="list">
		<header>Select Game Mode</header>
		{#each assets.modes as { name, description }}
			<div class="card">
				<GMCard {name} {description} on:select={select} />
			</div>
		{/each}
	</article>
</main>

<style lang="scss">
	@import '../../styles/vars';

	.card {
		box-shadow: $buttonShadow;
		display: block;
		width: 80%;

		margin: 1vh 0;

		&:hover {
			box-shadow: 0px 0px 1.1vh lime;
		}
	}

	main {
		display: flex;
		justify-content: space-around;
		align-items: center;

		background: #000000aa;

		width: 100%;
		height: 100%;

		article {
			display: flex;
			flex-direction: column;
			align-items: center;

			height: 90%;

			header {
				color: $title;
				font-family: $titleFont;
				text-shadow: 0 0 1vh $title;
				font-size: 3vw;
				margin: 3vh auto;
			}

			&.list {
				width: 50%;
			}

			&.imgdisplay {
				width: 35%;

				header {
					font-family: $textFont;
					color: $subtitle;
					text-shadow: 0 0 1vh $subtitle;
				}

				img {
					width: 85%;
					height: auto;
					box-shadow: $buttonShadow;
				}
			}
		}
	}
</style>
