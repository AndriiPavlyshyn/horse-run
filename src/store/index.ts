import Vue from 'vue'
import Vuex                                                 from 'vuex'
import { Horse, IndexStore, Round, RoundResult, RunStatus } from '@/types/interfaces';
import { getRandomInt }                                     from '@/utils/getRandomInt';

Vue.use(Vuex)

const HORSES_PER_RACE = 10

export default new Vuex.Store<IndexStore>({
	state: {
		horses: [],
		rounds: [],
		results: [],
		currentRoundIndex: -1,
		status: RunStatus.IDLE
	},
	mutations: {
		setHorses(state, horses: Horse[]) {
			state.horses = horses
		},
		setRounds(state, rounds: Round[]) {
			state.rounds = rounds
		},
		pushResult(state, result: RoundResult) {
			state.results.push(result)
		},
		setStatus(state, status: RunStatus) {
			state.status = status
		},
		setCurrentRoundIndex(state, idx: number) {
			state.currentRoundIndex = idx
		},
		reset(state) {
			state.horses = []
			state.rounds = []
			state.results = []
			state.currentRoundIndex = -1
			state.status = RunStatus.IDLE
		}
	},
	actions: {
		generateGame({ commit }) {
			const totalHorses = getRandomInt(10, 20)
			const horses = generateHorses(totalHorses);
			const rounds = generateRounds(totalHorses);

			commit('reset')
			commit('setHorses', horses)
			commit('setRounds', rounds)
			commit('setStatus', RunStatus.READY)
			commit('setCurrentRoundIndex', -1)
		},

		async startRace({ state, commit, dispatch }) {
			if (state.status !== RunStatus.READY) {
				return
			}

			commit('setStatus', RunStatus.RUNNING)

			for (let i = 0; i < state.rounds.length; i++) {
				commit('setCurrentRoundIndex', i)

				await dispatch('runRound', state.rounds[i])

				await new Promise((response) => {
					return setTimeout(response, 600)
				})
			}

			commit('setStatus', RunStatus.FINISHED)
			commit('setCurrentRoundIndex', -1)
		},

		async runRound({ state, commit }, round: Round) {
			const results: { horseId: number; timeMs: number }[] = []

			for (const id of round.horseIds) {
				const horse = state.horses.find((horse: Horse) => {
					return horse.id === id
				})

				if (!horse) {
					console.error(`Horse with id ${id} not found`)
					continue
				}

				const baseMs = round.distance * 2
				const speedMultiplier = 0.6 + horse.condition / 100
				const jitter = Math.random() * 300 - 150
				const minimumRaceTime = Math.round(baseMs / speedMultiplier + jitter)
				const timeMs = Math.max(800, minimumRaceTime)

				results.push({ horseId: id, timeMs })
			}

			results.sort((a, b) => {
				return a.timeMs - b.timeMs
			})

			const roundResult: RoundResult = {
				roundId: round.id,
				distance: round.distance,
				standings: results
			}

			commit('pushResult', roundResult)

			const maxMs = Math.max(...results.map((result) => {
				return result.timeMs
			}))
			const timeBuffer = 200

			await new Promise((result) => {
				return setTimeout(result, maxMs + timeBuffer)
			})
		}
	},
	getters: {
		getHorseById: (state) => (id: number) => {
			return state.horses.find((horse) => {
				return horse.id === id
			})
		},
		currentRound(state) {
			if (state.currentRoundIndex < 0) {
				return null
			}

			return state.rounds[state.currentRoundIndex]
		}
	}
})

function generateHorses(horsesNumber: number = 20): Horse[] {
	const colors = [
		'#EF798A',
		'#F7A9A8',
		'#613F75',
		'#E5C3D1',
		'#988B8E',
		'#ECC8AF',
		'#E7AD99',
		'#CE796B',
		'#C18C5D',
		'#495867',
		'#0A0908',
		'#22333B',
		'#F2F4F3',
		'#A9927D',
		'#5E503F',
		'#7209B7',
		'#F72585',
		'#4361EE',
		'#06FFA5',
		'#FFB703'
	]
	const horses: Horse[] = []

	for (let i = 0; i < horsesNumber; i++) {
		horses.push({
			id: i + 1,
			name: `Horse ${i + 1}`,
			color: colors[i],
			condition: getRandomInt(1, 100)
		})
	}

	return horses;
}

function generateRounds(totalHorses: number): Round[] {
	const distances = [1200, 1400, 1600, 1800, 2000, 2200]

	return distances.map((distance, idx) => {
		const ids = new Set<number>()

		while (ids.size < HORSES_PER_RACE) {
			ids.add(getRandomInt(1, totalHorses))
		}

		return {
			id: idx + 1,
			distance,
			horseIds: Array.from(ids)
		}
	})
}
