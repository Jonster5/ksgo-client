<script lang="ts">
	import type { Database } from '@/src/lib/data/multiplayer';
	import type firebase from 'firebase';
	import { onMount } from 'svelte';
	import App from '../App.svelte';

	import Lobbycard from './Lobbycard.svelte';

	export let FS: Database;

	interface GameInfo {
		KSGO_ID: string;
		maxPlayers: number;
		name: string;
		private: boolean;
	}

	const games = FS.collection('public-games')
		.get()
		.then((q) => q.docs.map((doc) => doc.data()) as GameInfo[]);
</script>

<main>
	<h2 class="title">Join Lobby</h2>
	<div class="c">
		{#await games}
			Loading...
		{:then docs}
			{#each docs as { KSGO_ID, maxPlayers, name }}
				<Lobbycard {KSGO_ID} {maxPlayers} {name} />
			{/each}
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
