<script lang="ts">
	let { data } = $props();
</script>

{#await data.number}
	Loading...
{:then number}
	{number}
{/await}
