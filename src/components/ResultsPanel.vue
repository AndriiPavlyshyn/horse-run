<template>
	<div class="results-panel">
		<div class="tabs">
			<button
				:class="['tab', { active: activeTab === 'program' }]"
				@click="activeTab = 'program'"
			>
				Program
			</button>
			<button
				:class="['tab', { active: activeTab === 'results' }]"
				@click="activeTab = 'results'"
			>
				Results
			</button>
		</div>

		<div class="tab-content">
			<div v-if="activeTab === 'program'" class="program-section">
				<div v-if="rounds.length === 0" class="empty-state">
					No program generated yet
				</div>
				<div v-else class="rounds-list">
					<div
						v-for="round in rounds"
						:key="round.id"
						class="round-program"
					>
						<div class="round-header">
							Round {{ round.id }} - {{ round.distance }}m
						</div>
						<table class="program-table">
							<thead>
								<tr>
									<th>Position</th>
									<th>Name</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(horseId, index) in round.horseIds" :key="horseId">
									<td>{{ index + 1 }}</td>
									<td>{{ getHorseName(horseId) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div v-if="activeTab === 'results'" class="results-section">
				<div v-if="results.length === 0" class="empty-state">
					No results yet
				</div>

				<div v-else class="results-list">
					<div
						v-for="result in results"
						:key="result.roundId"
						class="round-result"
					>
						<div class="round-title">
							Round {{ result.roundId }} — {{ result.distance }}m
						</div>

						<table class="results-table">
							<thead>
								<tr>
									<th>Position</th>
									<th>Horse</th>
									<th>Time (s)</th>
								</tr>
							</thead>

							<tbody>
							<tr
								v-for="(entry, index) in result.standings"
								:key="entry.horseId"
							>
								<td>{{ index + 1 }}</td>
								<td>{{ getHorseName(entry.horseId) }}</td>
								<td>{{ (entry.timeMs / 1000).toFixed(2) }}s</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from '@/hooks/useStore'

export default defineComponent({
	name: 'ResultsPanel',
	setup() {
		const store = useStore()
		const activeTab = ref('program')
		const rounds = computed(() => {
			return store.state.rounds
		})
		const results = computed(() => {
			return store.state.results
		})
		const getHorseName = (horseId) => {
			const horse = store.getters.getHorseById(horseId)

			return horse ? horse.name : ''
		}

		return { activeTab, rounds, results, getHorseName }
	}
})
</script>

<style scoped>
.results-panel {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
}

.tabs {
	display: flex;
	border-bottom: 2px solid #e5e7eb;
}

.tab {
	padding: 12px;
	background: #f9fafb;
	border: none;
	cursor: pointer;
	font-weight: 600;
	font-size: 14px;
	transition: all 0.2s;
}

.tab:first-child {
	border-radius: 8px 0 0 0;
}

.tab:last-child {
	border-radius: 0 8px 0 0;
}

.tab:hover {
	background: #f3f4f6;
}

.tab.active {
	background: #6ee7b7;
	color: #065f46;
}

.tab-content {
	overflow-y: auto;
	padding: 16px;
	max-height: 600px;
}

.empty-state {
	text-align: center;
	padding: 40px;
	color: #9ca3af;
}

.rounds-list,
.results-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.round-program,
.round-result {
	border: 1px solid #e5e7eb;
	border-radius: 6px;
	overflow: hidden;
}

.round-header,
.round-title {
	background: #ff6b6b;
	color: white;
	padding: 8px 12px;
	font-size: 13px;
	font-weight: bold;
}

.program-table,
.results-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.program-table th,
.results-table th {
	background: #f3f4f6;
	padding: 6px 8px;
	text-align: left;
	font-weight: 600;
	border-bottom: 2px solid #e5e7eb;
}

.program-table td,
.results-table td {
	padding: 4px 8px;
	border-bottom: 1px solid #f3f4f6;
}

.program-table tr:last-child td,
.results-table tr:last-child td {
	border-bottom: none;
}

.program-table tr:hover,
.results-table tr:hover {
	background: #f9fafb;
}
</style>
