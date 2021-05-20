<script lang="ts">
	export let ID: string;
	export let info: {
		name: string;
		map: string;
	};
</script>

<article title={ID}>
	<h3>{info.name}</h3>
</article>

<style lang="scss">
</style>
