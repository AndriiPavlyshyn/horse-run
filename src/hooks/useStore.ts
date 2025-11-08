import { getCurrentInstance } from 'vue'

export function useStore() {
	const instance = getCurrentInstance()

	if (!instance) {
		throw new Error('useStore must be called inside setup()')
	}

	return instance.proxy.$store
}
