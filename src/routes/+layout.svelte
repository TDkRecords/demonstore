<script>
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/logo.jpg" />
</svelte:head>

{@render children()}
