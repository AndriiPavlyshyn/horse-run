import Vuex from 'vuex'
import Vue from 'vue'
import store from '@/store'
import { RunStatus } from '@/types/interfaces'

Vue.use(Vuex)

describe('Vuex Store', () => {
	beforeEach(() => {
		store.commit('reset')
	})

	describe('Initial State', () => {
		it('should have correct initial state', () => {
			expect(store.state.horses).toEqual([])
			expect(store.state.rounds).toEqual([])
			expect(store.state.results).toEqual([])
			expect(store.state.currentRoundIndex).toBe(-1)
			expect(store.state.status).toBe(RunStatus.IDLE)
		})
	})

	describe('Mutations', () => {
		it('setHorses should update horses', () => {
			const horses = [
				{ id: 1, name: 'Horse 1', color: '#000', condition: 50 },
				{ id: 2, name: 'Horse 2', color: '#fff', condition: 60 }
			]

			store.commit('setHorses', horses)
			expect(store.state.horses).toEqual(horses)
		})

		it('setRounds should update rounds', () => {
			const rounds = [
				{ id: 1, distance: 1200, horseIds: [1, 2, 3] }
			]

			store.commit('setRounds', rounds)
			expect(store.state.rounds).toEqual(rounds)
		})

		it('pushResult should add result to results array', () => {
			const result = {
				roundId: 1,
				distance: 1200,
				standings: [{ horseId: 1, timeMs: 1000 }]
			}

			store.commit('pushResult', result)
			expect(store.state.results).toHaveLength(1)
			expect(store.state.results[0]).toEqual(result)
		})

		it('setStatus should update status', () => {
			store.commit('setStatus', RunStatus.READY)
			expect(store.state.status).toBe(RunStatus.READY)
		})

		it('setCurrentRoundIndex should update currentRoundIndex', () => {
			store.commit('setCurrentRoundIndex', 2)
			expect(store.state.currentRoundIndex).toBe(2)
		})

		it('reset should restore initial state', () => {
			store.commit('setHorses', [{ id: 1, name: 'Horse 1', color: '#000', condition: 50 }])
			store.commit('setStatus', RunStatus.RUNNING)
			store.commit('setCurrentRoundIndex', 3)

			store.commit('reset')

			expect(store.state.horses).toEqual([])
			expect(store.state.rounds).toEqual([])
			expect(store.state.results).toEqual([])
			expect(store.state.currentRoundIndex).toBe(-1)
			expect(store.state.status).toBe(RunStatus.IDLE)
		})
	})

	describe('Actions', () => {
		it('generateGame should create horses and rounds', () => {
			store.dispatch('generateGame')

			expect(store.state.horses.length).toBeGreaterThanOrEqual(10)
			expect(store.state.horses.length).toBeLessThanOrEqual(20)
			expect(store.state.rounds).toHaveLength(6)
			expect(store.state.status).toBe(RunStatus.READY)
			expect(store.state.currentRoundIndex).toBe(-1)
		})

		it('generateGame should create rounds with correct distances', () => {
			store.dispatch('generateGame')

			const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
			const actualDistances = store.state.rounds.map(r => r.distance)

			expect(actualDistances).toEqual(expectedDistances)
		})

		it('generateGame should create rounds with 10 horses each', () => {
			store.dispatch('generateGame')

			store.state.rounds.forEach(round => {
				expect(round.horseIds).toHaveLength(10)
			})
		})

		it('startRace should not start if status is not READY', async () => {
			await store.dispatch('startRace')
			expect(store.state.status).toBe(RunStatus.IDLE)
		})
	})

	describe('Getters', () => {
		it('getHorseById should return correct horse', () => {
			const horses = [
				{ id: 1, name: 'Horse 1', color: '#000', condition: 50 },
				{ id: 2, name: 'Horse 2', color: '#fff', condition: 60 }
			]

			store.commit('setHorses', horses)

			const horse = store.getters.getHorseById(1)
			expect(horse).toEqual(horses[0])
		})

		it('getHorseById should return undefined for non-existent id', () => {
			const horses = [
				{ id: 1, name: 'Horse 1', color: '#000', condition: 50 }
			]

			store.commit('setHorses', horses)

			const horse = store.getters.getHorseById(999)
			expect(horse).toBeUndefined()
		})

		it('currentRound should return null when currentRoundIndex is -1', () => {
			store.commit('setCurrentRoundIndex', -1)
			expect(store.getters.currentRound).toBeNull()
		})

		it('currentRound should return correct round', () => {
			const rounds = [
				{ id: 1, distance: 1200, horseIds: [1, 2, 3] },
				{ id: 2, distance: 1400, horseIds: [4, 5, 6] }
			]

			store.commit('setRounds', rounds)
			store.commit('setCurrentRoundIndex', 1)

			expect(store.getters.currentRound).toEqual(rounds[1])
		})
	})
})
