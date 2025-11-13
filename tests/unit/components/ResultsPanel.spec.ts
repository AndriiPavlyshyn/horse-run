import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ResultsPanel from '@/components/ResultsPanel.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ResultsPanel.vue', () => {
	let store: any
	let getters: any

	beforeEach(() => {
		getters = {
			getHorseById: () => (id: number) => {
				const horses = [
					{ id: 1, name: 'Horse 1', color: '#000', condition: 50 },
					{ id: 2, name: 'Horse 2', color: '#fff', condition: 60 }
				]
				return horses.find(h => h.id === id)
			}
		}

		store = new Vuex.Store({
			state: {
				rounds: [],
				results: []
			},
			getters
		})
	})

	it('should render Program and Results tabs', () => {
		const wrapper = mount(ResultsPanel, { store, localVue })
		const tabs = wrapper.findAll('.tab')

		expect(tabs.at(0).text()).toBe('Program')
		expect(tabs.at(1).text()).toBe('Results')
	})

	it('should show Program tab as active by default', () => {
		const wrapper = mount(ResultsPanel, { store, localVue })
		const programTab = wrapper.findAll('.tab').at(0)

		expect(programTab.classes()).toContain('active')
	})

	it('should switch to Results tab when clicked', async () => {
		const wrapper = mount(ResultsPanel, { store, localVue })
		const resultsTab = wrapper.findAll('.tab').at(1)

		await resultsTab.trigger('click')

		expect(resultsTab.classes()).toContain('active')
	})

	it('should display "No program generated yet" when no rounds', () => {
		const wrapper = mount(ResultsPanel, { store, localVue })
		expect(wrapper.find('.empty-state').text()).toBe('No program generated yet')
	})

	it('should display "No results yet" when no results', async () => {
		const wrapper = mount(ResultsPanel, { store, localVue })
		const resultsTab = wrapper.findAll('.tab').at(1)

		await resultsTab.trigger('click')

		expect(wrapper.find('.empty-state').text()).toBe('No results yet')
	})

	it('should display rounds in Program tab', () => {
		const rounds = [
			{ id: 1, distance: 1200, horseIds: [1, 2] },
			{ id: 2, distance: 1400, horseIds: [1, 2] }
		]

		store = new Vuex.Store({
			state: {
				rounds,
				results: []
			},
			getters
		})

		const wrapper = mount(ResultsPanel, { store, localVue })
		const roundPrograms = wrapper.findAll('.round-program')

		expect(roundPrograms.length).toBe(2)
	})

	it('should display results in Results tab', async () => {
		const results = [
			{
				roundId: 1,
				distance: 1200,
				standings: [
					{ horseId: 1, timeMs: 2500 },
					{ horseId: 2, timeMs: 2700 }
				]
			}
		]

		store = new Vuex.Store({
			state: {
				rounds: [],
				results
			},
			getters
		})

		const wrapper = mount(ResultsPanel, { store, localVue })
		const resultsTab = wrapper.findAll('.tab').at(1)

		await resultsTab.trigger('click')

		const roundResults = wrapper.findAll('.round-result')
		expect(roundResults.length).toBe(1)
	})

	it('should display correct round distance in program', () => {
		const rounds = [
			{ id: 1, distance: 1200, horseIds: [1] }
		]

		store = new Vuex.Store({
			state: {
				rounds,
				results: []
			},
			getters
		})

		const wrapper = mount(ResultsPanel, { store, localVue })
		expect(wrapper.text()).toContain('Round 1 - 1200m')
	})

	it('should display time in seconds in results', async () => {
		const results = [
			{
				roundId: 1,
				distance: 1200,
				standings: [
					{ horseId: 1, timeMs: 2500 }
				]
			}
		]

		store = new Vuex.Store({
			state: {
				rounds: [],
				results
			},
			getters
		})

		const wrapper = mount(ResultsPanel, { store, localVue })
		const resultsTab = wrapper.findAll('.tab').at(1)

		await resultsTab.trigger('click')

		expect(wrapper.text()).toContain('2.50s')
	})
})
