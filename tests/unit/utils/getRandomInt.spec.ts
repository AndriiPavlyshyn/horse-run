import { getRandomInt } from '@/utils/getRandomInt'

describe('getRandomInt', () => {
	it('should return a number within the specified range', () => {
		const min = 1
		const max = 10

		for (let i = 0; i < 100; i++) {
			const result = getRandomInt(min, max)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	})

	it('should return min when min equals max', () => {
		const value = 5
		const result = getRandomInt(value, value)
		expect(result).toBe(value)
	})

	it('should return an integer', () => {
		const result = getRandomInt(1, 100)
		expect(Number.isInteger(result)).toBe(true)
	})

	it('should work with negative numbers', () => {
		const min = -10
		const max = -1

		for (let i = 0; i < 50; i++) {
			const result = getRandomInt(min, max)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	})

	it('should work with range including zero', () => {
		const min = -5
		const max = 5

		for (let i = 0; i < 50; i++) {
			const result = getRandomInt(min, max)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	})
})
