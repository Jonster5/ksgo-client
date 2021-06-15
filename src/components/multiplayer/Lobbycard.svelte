<script lang="ts">
	import Peer from 'peerjs';

	export let KSGO_ID: string;
	export let maxPlayers: number;
	export let name: string;

	const test = () => {
		const peer = new Peer();

		const conn = peer.connect(KSGO_ID);

		conn.on('open', () => {
			console.log('open');
		});

		conn.on('error', console.error);
	};
</script>

<article title={KSGO_ID} on:click={test}>
	<h3>{name}</h3>
	<p>{maxPlayers} players max</p>
</article>

<style lang="scss">
	@import '../../styles/vars';

	article {
		background: $UIBoxBG;
		display: flex;
		flex-direction: column;
		justify-content: left;

		margin: 1vw 0;
		width: 100%;
		user-select: none;
		cursor: default;

		border: 0.2vh solid white;
		border-radius: 1vh;

		* {
			margin: 1vh 1vw;
		}

		h3 {
			color: #2a8c68;
			font-family: 'Righteous', sans-serif;
		}

		p {
			font-family: 'Trispace', monospace;
			color: white;
		}

		&:hover {
			background: #e0e0e049;
			color: black;
			cursor: pointer;

			* {
				color: black;
			}
		}

		&:active {
			background: #e0e0e0aa;
		}
	}
</style>
