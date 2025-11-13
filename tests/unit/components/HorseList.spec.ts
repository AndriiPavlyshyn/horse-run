import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import HorseList from '@/components/HorseList.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('HorseList.vue', () => {
	let store: any

	it('should display "No horses list yet" when no horses', () => {
		store = new Vuex.Store({
			state: {
				horses: []
			}
		})

		const wrapper = mount(HorseList, { store, localVue })
		expect(wrapper.find('.no-horse-list').text()).toBe('No horses list yet')
	})

	it('should render horses table when horses exist', () => {
		const horses = [
			{ id: 1, name: 'Horse 1', color: '#EF798A', condition: 50 },
			{ id: 2, name: 'Horse 2', color: '#F7A9A8', condition: 70 }
		]

		store = new Vuex.Store({
			state: {
				horses
			}
		})

		const wrapper = mount(HorseList, { store, localVue })
		expect(wrapper.find('.horses-table').exists()).toBe(true)
	})

	it('should display correct number of horses', () => {
		const horses = [
			{ id: 1, name: 'Horse 1', color: '#EF798A', condition: 50 },
			{ id: 2, name: 'Horse 2', color: '#F7A9A8', condition: 70 },
			{ id: 3, name: 'Horse 3', color: '#613F75', condition: 60 }
		]

		store = new Vuex.Store({
			state: {
				horses
			}
		})

		const wrapper = mount(HorseList, { store, localVue })
		const rows = wrapper.findAll('.horses-table tbody tr')
		expect(rows.length).toBe(3)
	})

	it('should display horse information correctly', () => {
		const horses = [
			{ id: 1, name: 'Thunder', color: '#EF798A', condition: 85 }
		]

		store = new Vuex.Store({
			state: {
				horses
			}
		})

		const wrapper = mount(HorseList, { store, localVue })
		const firstRow = wrapper.find('.horses-table tbody tr')

		expect(firstRow.text()).toContain('Thunder')
		expect(firstRow.text()).toContain('85')
	})

	it('should render title', () => {
		store = new Vuex.Store({
			state: {
				horses: []
			}
		})

		const wrapper = mount(HorseList, { store, localVue })
		expect(wrapper.find('.title').text()).toBe('Horse List (1-20)')
	})
})
