export type RunStatus = 'idle' | 'ready' | 'running' | 'finished';

export interface IndexStore {
	status: RunStatus
	horses: Horse[]
	rounds: Round[]
	results: RoundResult[]
	currentRoundIndex: number
}

export interface Horse {
	id: number
	name: string
	color: string
	condition: number
}

export interface Round {
	id: number
	distance: number
	horseIds: number[]
}

export interface RoundResult {
	roundId: number
	distance: number
	standings: Standing[]
}

export interface Standing {
	horseId: number;
	timeMs: number
}
