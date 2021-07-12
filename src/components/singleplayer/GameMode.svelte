<script lang="ts">
	import GMCard from './GMCard.svelte';

	import type { ParsedAssets } from '@data/assetTypes';
	import Backbutton from '@comp/general/Backbutton.svelte';

	export let assets: ParsedAssets;
</script>

<main>
	<Backbutton target="title" on:click />
	<article class="imgdisplay">
		<img src="" alt="" />
	</article>
	<article class="list">
		<header>Select Game Type</header>

		<!-- <GMCard /> -->
	</article>
</main>

<style lang="scss">
	@import '../../styles/vars';

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

			border: 1px solid white;

			&.list {
				width: 50%;

				header {
					color: $title;
					font-family: $titleFont;
				}
			}

			&.imgdisplay {
				width: 35%;

				img {
					border: 1px solid gold;

					width: 85%;
					height: auto;
				}
			}
		}
	}
</style>
