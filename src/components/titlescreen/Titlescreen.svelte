<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './LinkIcon.svelte';
	import GithubSrc from '@assets/images/github.png';
	import KofiSrc from '@assets/images/kofi.png';
	import discordSrc from '@assets/images/Discord_Logo_Square.png';
	import SettingsIcon from '@comp/general/SettingsIcon.svelte';

	const dispatch = createEventDispatcher();

	const click = (screen: string): void => {
		dispatch('click', {
			screen,
		});
	};
</script>

<main>
	<SettingsIcon />

	<div class="icons">
		<Icon
			src={GithubSrc}
			alt="KSGO's Github"
			href="https://github.com/Jonster5/ksgo-client"
			title="Github"
		/>
		<Icon src={KofiSrc} alt="KSGO's Kofi page" href="https://ko-fi.com/ksgogame" title="Kofi" />
		<Icon
			src={discordSrc}
			alt="KSGO Community Discord Server"
			href="https://discord.gg/xVN6WaKYuT"
			title="Discord"
		/>
	</div>

	<div class="title">Black Lives <strong>Matter</strong></div>
	<div class="version">V0.1</div>
	<div class="button" on:click={() => click('play')}>Play</div>
	<div class="button" on:click={() => alert('Coming soon')}>Leaderboards</div>
	<div class="button" on:click={() => alert('Coming soon')}>Shop</div>
</main>

<style lang="scss">
	@import '../../styles/vars';

	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.icons {
		display: flex;
		position: fixed;
		right: 1vw;
		top: 1vw;
	}

	.title {
		font-family: 'Righteous';
		-moz-user-select: none;
		-webkit-user-select: none;
		color: $title;
		text-shadow: 0 0 20vh $title;
		font-size: 10vw;
		margin: 4vh 4vw;
		margin-bottom: 2vh;

		strong {
			text-shadow: 0 0 20vh white;
		}
	}

	.version {
		font-family: 'Trispace';
		-moz-user-select: none;
		-webkit-user-select: none;
		color: $subtitle;
		background: $UIBoxBG;
		text-shadow: 0 0 1vh $subtitle;
		padding: 1vh 1vw;
		font-size: 1vw;
		margin: 2vh;
		margin-top: 0;
	}

	.button {
		@include Button;
		width: 15%;
		margin: 2vh 1vw;
		font-size: 2vw;
		user-select: none;
	}
</style>
