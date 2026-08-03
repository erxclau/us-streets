<script>
	import { page } from '$app/state';
	import AppError from '$lib/error.svelte';
</script>

<AppError error={String(page.status)} message={page.error?.message} />
