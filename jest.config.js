module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
	transform: {
		'^.+\\.vue$': 'vue-jest',
		'^.+\\.tsx?$': 'ts-jest',
		'^.+\\.js$': 'babel-jest'
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	testMatch: [
		'**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
		'**/__tests__/*.(js|jsx|ts|tsx)'
	],
	collectCoverageFrom: [
		'src/**/*.{js,ts,vue}',
		'!src/main.js',
		'!src/**/*.d.ts'
	]
}
