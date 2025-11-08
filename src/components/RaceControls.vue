<template>
	<div class="controls">
		<button @click="generateGame" class="button">
			Generate Game
		</button>

		<button
			@click="startRace"
			class="button"
			:disabled="!isReady"
		>
			Start Race
		</button>
	</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from '@/hooks/useStore'

export default defineComponent({
	name: 'RaceControls',
	setup() {
		const store = useStore()

		const isReady = computed(() => {
			return store.state.status === 'ready'
		})

		const generateGame = () => {
			store.dispatch('generateGame')
		}

		const startRace = () => {
			store.dispatch('startRace')
		}

		return {
			isReady,
			generateGame,
			startRace
		}
	}
})
</script>

<style scoped>
.controls {
	display: flex;
	gap: 10px;
}

.button {
	background: #4f46e5;
	color: white;
	padding: 8px 14px;
	border-radius: 6px;
	border: none;
	cursor: pointer;
	font-size: 14px;
}

.button:disabled {
	background: #9ca3af;
	cursor: not-allowed;
}
</style>
