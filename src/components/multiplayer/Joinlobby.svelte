<script lang="ts">
	import type { FireStore } from '@/src/lib/data/multiplayer';
	import type firebase from 'firebase';
	import { onMount } from 'svelte';

	import Lobbycard from './Lobbycard.svelte';

	export let FS: FireStore;

	let docs: firebase.firestore.DocumentData[];

	onMount(async () => {
		await FS.collection('test')
			.get()
			.then((q) => {
				docs = q.docs.map((doc) => doc.data());
			});
	});
</script>

<main>
	<h2 class="title">Join Lobby</h2>
	<div class="c" />
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
