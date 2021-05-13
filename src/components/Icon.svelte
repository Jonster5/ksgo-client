<script lang="ts">
	export let src: string;
	export let href: string = '/';
	export let alt: string = '';
	export let title: string = '';
</script>

<a {href} target="_blank">
	<img {src} {alt} {title} />
</a>

<style lang="scss">
	@import '../styles/vars.scss';

	a {
		display: flex;

		text-decoration: none;

		margin: 1vh;

		img {
			width: 3vw;
			height: auto;
			border-radius: 50%;
			transition-duration: 100ms;
		}

		&:hover img {
			box-shadow: 0 0 0.5vw 0.2vw white;
		}
	}
</style>
