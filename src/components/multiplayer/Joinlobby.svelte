<script lang="ts">
	import type { Database, DBGameInfo } from '@/src/lib/data/multiplayer';

	import Lobbycard from './Lobbycard.svelte';

	export let FS: Database;

	const games = FS.collection('public-games')
		.get()
		.then(
			(q) =>
				q.docs
					.map((doc) => doc.data())
					.sort((a, b) => a.time - b.time) as DBGameInfo[]
		);
</script>

<main>
	<h2 class="title">Join Lobby</h2>
	<div class="c">
		{#await games}
			Loading...
		{:then docs}
			{#if docs.length > 0}
				{#each docs as { KSGO_ID, maxPlayers, name }}
					<Lobbycard {KSGO_ID} {maxPlayers} {name} />
				{/each}
			{:else}
				No Games Available
			{/if}
		{/await}
	</div>
</main>

<style lang="scss">
	@import '../../styles/vars.scss';

	main {
		width: 25vw;
		height: 80vh;
	}

	h2 {
		width: 100%;
		color: $title;
		text-align: center;
		font-family: 'Righteous';
		font-size: 2vw;
		margin: 2vh auto 5vh auto;
	}

	.c {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
