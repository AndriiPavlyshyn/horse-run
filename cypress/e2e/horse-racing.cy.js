describe('Horse Racing Game', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('should display initial state with Generate Game button', () => {
		cy.contains('Horse Racing').should('be.visible')
		cy.contains('Generate Game').should('be.visible')
		cy.contains('Start Race').should('be.disabled')
		cy.contains('Click "Generate Game" to create new game').should('be.visible')
	})

	it('should generate game and display horses and rounds info', () => {
		cy.contains('Generate Game').click()

		cy.contains('Game generated!').should('be.visible')
		cy.contains(/Horses: \d+/).should('be.visible')
		cy.contains(/Rounds: 6/).should('be.visible')
		cy.contains('Click "Start Race" to start a competition').should('be.visible')
		cy.contains('Start Race').should('not.be.disabled')
	})

	it('should display horses list after game generation', () => {
		cy.contains('Generate Game').click()

		cy.get('.horses-table tbody tr').should('have.length.greaterThan', 0)
		cy.get('.horses-table tbody tr').first().should('contain', 'Horse')
	})

	it('should start race and show animation', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.get('.track-container').should('be.visible')
		cy.contains(/Round \d+ - \d+m/).should('be.visible')
		cy.get('.lane').should('have.length', 10)
		cy.get('.horse').should('have.length', 10)
	})

	it('should complete all rounds and show winner', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.contains('🏆 Winner:', { timeout: 60000 }).should('be.visible')
		cy.get('.winner-name').should('be.visible')
		cy.contains('Full results are on the right >').should('be.visible')
	})

	it('should display results panel with all rounds', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.contains('🏆 Winner:', { timeout: 60000 }).should('be.visible')

		cy.contains('Results').click()
		cy.get('.round-result').should('have.length', 6)
		cy.get('.round-result').first().should('contain', 'Round 1')
	})

	it('should show position badges when horses finish', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.get('.position-badge', { timeout: 10000 }).should('have.length.greaterThan', 0)
	})

	it('should allow generating new game after completion', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.contains('🏆 Winner:', { timeout: 60000 }).should('be.visible')

		cy.contains('Generate Game').click()
		cy.contains('Game generated!').should('be.visible')
		cy.contains('Start Race').should('not.be.disabled')
	})

	it('should display different horses in each round', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.get('.lane-name').first().invoke('text').then((firstRoundFirstHorse) => {
			cy.wait(5000)

			cy.get('.lane-name').first().invoke('text').should((secondRoundFirstHorse) => {
				expect(firstRoundFirstHorse).to.not.equal(secondRoundFirstHorse)
			})
		})
	})

	it('should show correct number of lanes per round', () => {
		cy.contains('Generate Game').click()
		cy.contains('Start Race').click()

		cy.get('.lane').should('have.length', 10)
		cy.get('.lane-number').should('have.length', 10)
	})
})
