<script lang="ts">
	import Backbutton from '@comp/general/Backbutton.svelte';
	import StartButton from '@comp/singleplayer/StartButton.svelte';
	import type { ParsedAssets, ParsedMapItem, ParsedModeItem } from '@data/assetTypes';
	import type { OutputOptionProperties } from '@data/gameTypes';
	import { createEventDispatcher, onMount } from 'svelte';
	import ArrowRightSrc from '@assets/images/optionSelectArrowRight.svg';
	import ArrowLeftSrc from '@assets/images/optionSelectArrowLeft.svg';
	import type { Writable } from 'svelte/store';

	export let assets: ParsedAssets;

	export let mode: Writable<string>;
	export let map: Writable<string>;
	export let gravity: Writable<number>;
	export let timeLimit: Writable<number>;
	export let killLimit: Writable<number>;
	export let extra: Object;

	const dispatch = createEventDispatcher();

	const modes = assets.modes;
	let modeIndex = 0;
	$: modeName = $mode;
	$: modeSrc = modes.find((m) => m.name === $mode).thumb.src;
	$: modeAlt = modes.find((m) => m.name === $mode).alt;

	const selectModeUp = () =>
		($mode = modes[modeIndex + 1 > modes.length - 1 ? (modeIndex = 0) : (modeIndex += 1)].name);
	const selectModeDown = () =>
		($mode = modes[modeIndex - 1 < 0 ? (modeIndex = modes.length - 1) : (modeIndex -= 1)].name);

	const maps = assets.maps;
	let mapIndex = 0;
	$: mapName = $map;
	$: mapSrc = maps.find((m) => m.name === $map).thumb.src;
	$: mapAlt = maps.find((m) => m.name === $map).alt;

	const selectMapUp = () =>
		($map = maps[mapIndex + 1 > maps.length - 1 ? (mapIndex = 0) : (mapIndex += 1)].name);
	const selectMapDown = () =>
		($map = maps[mapIndex - 1 < 0 ? (mapIndex = maps.length - 1) : (mapIndex -= 1)].name);

	$: if ($gravity < 0) {
		$gravity = 0;
	} else if ($gravity >= 30) {
		$gravity = 30;
	}

	const selectGravityUp = () => ($gravity += 1);
	const selectGravityDown = () => ($gravity -= 1);

	$: if ($timeLimit < 0) {
		$timeLimit = 0;
	} else if ($timeLimit >= 10) {
		$timeLimit = 10;
	}

	const timeLimitUp = () => ($timeLimit += 1);
	const timeLimitDown = () => ($timeLimit -= 1);

	$: if ($killLimit < 0) {
		$killLimit = 0;
	}

	const killLimitUp = () => ($killLimit += 5);
	const killLimitDown = () => ($killLimit -= 5);

	const start = () => {
		dispatch('start', {
			mode: modes.find((m) => m.name === $mode),
			map: maps.find((m) => m.name === $map),
			gravity: $gravity / 10,
			timeLimit: $timeLimit * 60,
			killLimit: $killLimit,
			extra: {},
		} as OutputOptionProperties);
	};
</script>

<main>
	<Backbutton target="game mode" on:click />
	<StartButton on:start={start} />
	<div class="segment mode">
		<div class="c">
			<h2>Select<br /> Game Mode</h2>
		</div>
		<div class="c">
			<h3>{modeName}</h3>
			<div class="ic">
				<img
					class="arrow"
					src={ArrowLeftSrc}
					alt="Arrow facing left"
					on:click={selectModeDown}
				/>
				<img class="display" src={modeSrc} alt={modeAlt} />
				<img
					class="arrow"
					src={ArrowRightSrc}
					alt="Arrow facing Right"
					on:click={selectModeUp}
				/>
			</div>
		</div>
	</div>
	<div class="segment map">
		<div class="c">
			<h2>Select Map</h2>
		</div>
		<div class="c">
			<h3>{mapName}</h3>
			<div class="ic">
				<img
					class="arrow"
					src={ArrowLeftSrc}
					alt="Arrow facing left"
					on:click={selectMapDown}
				/>
				<img class="display" src={mapSrc} alt={mapAlt} />
				<img
					class="arrow"
					src={ArrowRightSrc}
					alt="Arrow facing right"
					on:click={selectMapUp}
				/>
			</div>
		</div>
	</div>
	<div class="segment condition">
		<div class="c">
			<h2>Set Time Limit</h2>
			<div class="ic">
				<img
					class="arrow"
					src={ArrowLeftSrc}
					alt="Arrow facing left"
					on:click={timeLimitDown}
				/>
				<h3>
					{@html $timeLimit ? `${$timeLimit}<br />Minutes` : `None`}
				</h3>
				<img
					class="arrow"
					src={ArrowRightSrc}
					alt="Arrow facing right"
					on:click={timeLimitUp}
				/>
			</div>
		</div>
		<div class="c">
			<h2>Set Kill Limit</h2>
			<div class="ic">
				<img
					class="arrow"
					src={ArrowLeftSrc}
					alt="Arrow facing left"
					on:click={killLimitDown}
				/>
				<h3>
					{@html $killLimit ? `${$killLimit}<br />Kills` : `None`}
				</h3>
				<img
					class="arrow"
					src={ArrowRightSrc}
					alt="Arrow facing right"
					on:click={killLimitUp}
				/>
			</div>
		</div>
	</div>
	<div class="segment gravity">
		<div class="c">
			<h2>Set Gravity Multiplier</h2>
		</div>
		<div class="c">
			<img
				class="arrow"
				src={ArrowLeftSrc}
				alt="Arrow facing left"
				on:click={selectGravityDown}
			/>
			<h3>
				{$gravity / 10 === Math.floor($gravity / 10)
					? `${$gravity / 10}.0`
					: $gravity / 10}x
			</h3>
			<img
				class="arrow"
				src={ArrowRightSrc}
				alt="Arrow facing right"
				on:click={selectGravityUp}
			/>
		</div>
	</div>
	<div class="segment extra">
		<h4>{extra} (ignore this for now)</h4>
	</div>
</main>

<style lang="scss">
	@import '../../styles/vars';

	main {
		display: grid;
		width: 100%;
		height: 100%;
		padding: 1vh;
		box-sizing: border-box;
		grid-gap: 1vh;
		grid-template-columns: repeat(5, calc(20vw - 1.25vh));
		grid-template-rows: repeat(3, 1fr);
		grid-template-areas:
			'a a c c e'
			'b b c c e'
			'b b d d e';

		.mode {
			grid-area: a;

			display: flex;

			.c {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				width: 50%;
				height: 100%;

				h2 {
					font-size: 2vw;
					font-family: $titleFont;
					color: $title;
					text-shadow: 0 0 0.6vh $title;
				}

				h3 {
					font-size: 1.5vw;
					font-family: $textFont;
					color: $subtitle;
					text-shadow: 0 0 0.5vh $subtitle;
					margin: 0 0 2vh 0;
				}

				.ic {
					display: flex;
					justify-content: center;

					.arrow {
						width: 8%;
						height: auto;
						margin: 1vw;

						&:hover {
							filter: brightness(120%);
							cursor: pointer;
						}

						&:active {
							filter: brightness(130%);
						}
					}

					.display {
						width: 40%;
						height: auto;
						box-shadow: 0 0 1vh $title;
					}
				}
			}
		}

		.map {
			grid-area: b;

			display: flex;
			flex-direction: column;

			.c {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				h2 {
					font-size: 2vw;
					font-family: $titleFont;
					color: $title;
					text-shadow: 0 0 0.6vh $title;
				}

				h3 {
					font-size: 1.5vw;
					font-family: $textFont;
					color: $subtitle;
					text-shadow: 0 0 0.5vh $subtitle;
					margin: 0 0 2vh 0;
				}

				.ic {
					display: flex;
					justify-content: center;

					.arrow {
						width: 8%;
						height: auto;
						margin: 1vw;

						&:hover {
							filter: brightness(120%);
							cursor: pointer;
						}

						&:active {
							filter: brightness(130%);
						}
					}

					.display {
						width: 40%;
						height: auto;
						box-shadow: 0 0 1vh $title;
					}
				}
			}
		}

		.condition {
			grid-area: c;

			display: flex;
			flex-direction: column;

			.c {
				display: flex;
				justify-content: center;
				align-items: center;

				width: 100%;
				height: 50%;

				h2 {
					font-size: 2vw;
					font-family: $titleFont;
					color: $title;
					text-shadow: 0 0 0.6vh $title;
					width: 50%;
					text-align: center;
				}

				h3 {
					font-size: 1.5vw;
					font-family: $textFont;
					color: $subtitle;
					text-align: center;
					text-shadow: 0 0 0.5vh $subtitle;
					margin: 0 0 2vh 0;
				}

				.ic {
					display: flex;
					align-items: center;
					width: 50%;

					.arrow {
						width: 4%;
						height: auto;
						margin: 1vw;

						&:hover {
							filter: brightness(120%);
							cursor: pointer;
						}

						&:active {
							filter: brightness(130%);
						}
					}

					.display {
						width: 40%;
						height: auto;
						box-shadow: 0 0 1vh $title;
					}
				}
			}
		}

		.gravity {
			grid-area: d;

			display: flex;

			.c {
				display: flex;
				justify-content: center;
				align-items: center;
				// text-align: center;

				width: 50%;
				height: 100%;

				h2 {
					font-size: 2vw;
					font-family: $titleFont;
					color: $title;
					text-shadow: 0 0 0.6vh $title;
					width: 100%;
					text-align: center;
				}

				h3 {
					font-size: 2vw;
					font-family: $textFont;
					color: $subtitle;
					text-shadow: 0 0 1vh $subtitle;
				}

				.arrow {
					width: 12%;
					height: 20%;
					margin: 0.2vw;

					&:hover {
						filter: brightness(120%);
						cursor: pointer;
					}

					&:active {
						filter: brightness(130%);
					}
				}
			}
		}

		.extra {
			grid-area: e;
		}

		.segment {
			background: #000000aa;
			box-shadow: 0 0 0.8vh #ffffff70;
			transition-duration: 100ms;

			&:hover {
				box-shadow: 0 0 0.8vh $accent;
			}
		}
	}
</style>
