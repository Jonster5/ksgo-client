<script lang="ts">
	export let KSGO_ID: string;
	export let maxPlayers: number;
	export let name: string;
</script>

<article title={KSGO_ID}>
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
