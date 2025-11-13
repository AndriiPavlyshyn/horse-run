import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import RaceControls from '@/components/RaceControls.vue'
import { RunStatus } from '@/types/interfaces'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('RaceControls.vue', () => {
	let store: any
	let actions: any

	beforeEach(() => {
		actions = {
			generateGame: jest.fn(),
			startRace: jest.fn()
		}

		store = new Vuex.Store({
			state: {
				status: RunStatus.IDLE
			},
			actions
		})
	})

	it('should render Generate Game button', () => {
		const wrapper = mount(RaceControls, { store, localVue })
		expect(wrapper.find('.button').text()).toBe('Generate Game')
	})

	it('should render Start Race button', () => {
		const wrapper = mount(RaceControls, { store, localVue })
		const buttons = wrapper.findAll('.button')
		expect(buttons.at(1).text()).toBe('Start Race')
	})

	it('should disable Start Race button when status is not READY', () => {
		const wrapper = mount(RaceControls, { store, localVue })
		const startButton = wrapper.findAll('.button').at(1)
		expect(startButton.attributes('disabled')).toBe('disabled')
	})

	it('should enable Start Race button when status is READY', () => {
		store = new Vuex.Store({
			state: {
				status: RunStatus.READY
			},
			actions
		})

		const wrapper = mount(RaceControls, { store, localVue })
		const startButton = wrapper.findAll('.button').at(1)
		expect(startButton.attributes('disabled')).toBeUndefined()
	})

	it('should call generateGame action when Generate Game button is clicked', async () => {
		const wrapper = mount(RaceControls, { store, localVue })
		const generateButton = wrapper.findAll('.button').at(0)

		await generateButton.trigger('click')

		expect(actions.generateGame).toHaveBeenCalled()
	})

	it('should call startRace action when Start Race button is clicked', async () => {
		store = new Vuex.Store({
			state: {
				status: RunStatus.READY
			},
			actions
		})

		const wrapper = mount(RaceControls, { store, localVue })
		const startButton = wrapper.findAll('.button').at(1)

		await startButton.trigger('click')

		expect(actions.startRace).toHaveBeenCalled()
	})
})
