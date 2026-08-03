<div></div>

<style>
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
			background-color: var(--color-dark-highlight);
		}

		50% {
			background-color: var(--color-light-highlight);
		}

		100% {
			transform: rotate(180deg);
			background-color: var(--color-dark-highlight);
		}
	}

	div {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 0.25rem;
		animation: 2s infinite rotate;
	}
</style>
