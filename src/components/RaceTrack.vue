<template>
	<div class="race-track">
		<div v-if="currentRound" class="track-container">
			<h2>Round {{ currentRound.id }} - {{ currentRound.distance }}m</h2>

			<div class="track-wrapper">
				<div class="lane-numbers">
					<div
						v-for="(horseId, index) in currentRound.horseIds"
						:key="`num-${horseId}`"
						class="lane-number"
					>
						{{ index + 1 }}
					</div>
				</div>
				<div class="lanes">
					<div
						v-for="horseId in currentRound.horseIds"
						:key="horseId"
						class="lane"
					>
						<div class="lane-name">{{ getHorseName(horseId) }}</div>
						<div class="lane-track">
							<div class="horse" :style="{ ...getHorseStyle(horseId), backgroundColor: getHorseColor(horseId) }"></div>
							<div v-if="getHorsePosition(horseId)" class="position-badge">{{ getHorsePosition(horseId) }}</div>
						</div>
					</div>
					<div class="finish-label">FINISH</div>
				</div>
			</div>
		</div>

		<div v-else class="no-race">
			<p v-if="status === 'idle'">Click "Generate Game" to create new game</p>

			<div v-else-if="status === 'ready'" class="game-info">
				<p class="info-title">Game generated!</p>
				<p>Horses: {{ horsesCount }}</p>
				<p>Rounds: {{ roundsCount }}</p>
				<p class="info-subtitle">Click "Start Race" to start a competition</p>
			</div>

			<div v-else-if="status === 'finished'" class="winner-section">
				<p class="winner-title">🏆 Winner:</p>
				<p class="winner-name">{{ getWinnerName() }}</p>
				<p class="winner-subtitle">Full results are on the right ></p>
			</div>
		</div>

	</div>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from '@/hooks/useStore'

export default defineComponent({
	name: 'RaceTrack',
	setup() {
		const store = useStore()
		const animatingHorses = ref(new Map())
		const finishedHorses = ref(new Map())

		const currentRound = computed(() => {
			return store.getters.currentRound
		})

		const status = computed(() => {
			return store.state.status
		})

		const results = computed(() => {
			return store.state.results
		})

		const horsesCount = computed(() => {
			return store.state.horses.length
		})

		const roundsCount = computed(() => {
			return store.state.rounds.length
		})

		const getHorseName = (horseId) => {
			const horse = store.getters.getHorseById(horseId)

			return horse ? horse.name : ''
		}

		const getWinnerName = () => {
			const allResults = results.value
			if (allResults.length === 0) {
				return ''
			}

			const scores = new Map()

			allResults.forEach(result => {
				result.standings.forEach((standing, index) => {
					const points = 10 - index
					const currentScore = scores.get(standing.horseId) || 0

					scores.set(standing.horseId, currentScore + points)
				})
			})

			let winnerId = 0
			let maxScore = 0

			scores.forEach((score, horseId) => {
				if (score > maxScore) {
					maxScore = score
					winnerId = horseId
				}
			})

			return getHorseName(winnerId)
		}

		const getHorseColor = (horseId) => {
			const horse = store.getters.getHorseById(horseId)

			return horse ? horse.color : '#000'
		}

		const getHorseTime = (horseId) => {
			const round = currentRound.value

			if (!round) {
				return 0
			}

			const resultItem = results.value.find((result) => {
				return result.roundId === round.id
			})

			if (!resultItem) {
				return 0
			}

			const entry = resultItem.standings.find((standing) => {
				return standing.horseId === horseId
			})

			if (!entry) {
				return 0
			}

			return entry.timeMs
		}

		const getHorseStyle = (horseId) => {
			const time = getHorseTime(horseId)
			const isAnimating = animatingHorses.value.get(horseId)
			const progress = (time > 0 && isAnimating) ? 1 : 0

			return {
				left: `${progress * 95}%`,
				transition: time > 0 ? `left ${time}ms linear` : 'none'
			}
		}

		const getHorsePosition = (horseId) => {
			if (!finishedHorses.value.get(horseId)) {
				return null
			}

			const round = currentRound.value

			if (!round) {
				return null
			}

			const resultItem = results.value.find((result) => {
				return result.roundId === round.id
			})

			if (!resultItem) {
				return null
			}

			const position = resultItem.standings.findIndex((standing) => {
				return standing.horseId === horseId
			})

			if (position === -1) {
				return null
			}

			return position + 1
		}

		watch(currentRound, (newRound) => {
			if (!newRound) {
				return
			}

			animatingHorses.value = new Map()
			finishedHorses.value = new Map()

			setTimeout(() => {
				animatingHorses.value = new Map(
					newRound.horseIds.map(id => [id, true])
				)

				newRound.horseIds.forEach(horseId => {
					const time = getHorseTime(horseId)
					if (time > 0) {
						setTimeout(() => {
							finishedHorses.value.set(horseId, true)
							finishedHorses.value = new Map(finishedHorses.value)
						}, time)
					}
				})
			}, 50)
		})

		return { currentRound, status, horsesCount, roundsCount, getHorseName, getHorseColor, getHorseStyle, getHorsePosition, getWinnerName }
	}
})
</script>

<style scoped>
.race-track {
	padding: 20px;
}

.track-container h2 {
	margin-bottom: 20px;
	text-align: center;
}

.track-wrapper {
	display: flex;
	gap: 0;
	border: 2px solid #8b4513;
	border-radius: 12px;
	overflow: hidden;
}

.lane-numbers {
	background: #5a8f5a;
	display: flex;
	flex-direction: column;
	width: 40px;
	border-right: 2px solid #4a7a4a;
}

.lane-number {
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: bold;
	font-size: 16px;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
}

.lane-number:last-child {
	border-bottom: none;
}

.lanes {
	width: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
}

.lane {
	display: grid;
	grid-template-columns: 150px 1fr;
	column-gap: 10px;
	align-items: center;
	height: 50px;
	width: 100%;
	border-bottom: 1px dashed #999;
}

.lane:last-child {
	border-bottom: none;
}

.lane-name {
	min-width: 150px;
	font-weight: bold;
	padding-left: 10px;
	font-size: 13px;
}

.lane-track {
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, #f5e6d3 0%, #f0dac0 50%, #f5e6d3 100%);
	position: relative;
	overflow: hidden;
}

.horse {
	position: absolute;
	left: 0%;
	top: 50%;
	transform: translateY(-50%);
	width: 30px;
	height: 20px;
	border-radius: 50% 50% 40% 40%;
	will-change: left;
	box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.position-badge {
	position: absolute;
	right: 5px;
	top: 50%;
	transform: translateY(-50%);
	background: #4f46e5;
	color: white;
	font-weight: bold;
	font-size: 14px;
	padding: 4px 8px;
	border-radius: 12px;
	min-width: 24px;
	text-align: center;
	box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.finish-label {
	position: absolute;
	right: -20px;
	top: 50%;
	transform: translateY(-50%);
	color: red;
	font-weight: bold;
	font-size: 14px;
	writing-mode: vertical-rl;
	text-orientation: mixed;
}

.no-race {
	text-align: center;
	padding: 40px;
	color: #666;
}

.game-info {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.info-title {
	font-weight: bold;
	font-size: 18px;
	color: #4f46e5;
	margin-bottom: 8px;
}

.info-subtitle {
	margin-top: 12px;
	font-style: italic;
	color: #4f46e5;
}

.winner-section {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
}

.winner-title {
	font-weight: bold;
	font-size: 20px;
	color: #d97706;
	margin-bottom: 8px;
}

.winner-name {
	font-size: 28px;
	font-weight: bold;
	color: #059669;
	text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.winner-subtitle {
	margin-top: 12px;
	font-style: italic;
	color: #6b7280;
	font-size: 14px;
}
</style>
