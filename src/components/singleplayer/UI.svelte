<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let energy: Writable<number>;
	export let maxEnergy: number = 0;

	export let speed: Writable<number>;
	export let maxSpeed: number = 0;

	export let hull: Writable<number>;
	export let maxHull: number = 0;

	export let cooldown: Writable<boolean>;

	$: e = 100 - ($energy / maxEnergy) * 100;
	$: h = 100 - ($hull / maxHull) * 100;
	$: s = 100 - ($speed / maxSpeed) * 100;

	onDestroy(() => {});
</script>

<article class="right">
	<div class="energyDisplay" style={$cooldown ? 'background-color: red' : ''}>
		<div style={`height: ${e}%`} />
	</div>
	<div class="hullDisplay">
		<div style={`height: ${h}%`} />
	</div>
</article>

<article class="left">
	<div class="speedDisplay">
		<div style={`height: ${s}%`} />
	</div>
</article>

<style lang="scss">
	@import '../../styles/vars';

	article {
		position: absolute;
		display: flex;
		justify-content: space-evenly;
		align-items: center;

		background-color: $UIBoxBG;

		div {
			div {
				transition-duration: 100ms;
			}
		}
	}

	.right {
		right: 1vw;
		bottom: 5vh;
		height: 50vh;
		width: 5vw;
	}

	.left {
		left: 1vw;
		bottom: 5vh;
		height: 25vh;
		width: 5vw;
	}

	.energyDisplay {
		width: 15%;
		height: 90%;
		background-color: gold;
		div {
			background-color: $UIBarBG;
			width: 100%;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			background-color: red;
		}
		50% {
			background-color: gold;
		}
	}

	@keyframes flash {
		50% {
			background-color: lime;
		}
		100% {
			background-color: gold;
		}
	}

	.hullDisplay {
		background-color: #4d7bd6;
		width: 15%;
		height: 90%;
		div {
			background-color: $UIBarBG;
			width: 100%;
		}
	}

	.speedDisplay {
		background-color: #87fa94;
		width: 15%;
		height: 80%;
		div {
			background-color: $UIBarBG;
			width: 100%;
		}
	}
</style>
