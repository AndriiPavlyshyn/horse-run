<template>
	<div class="app-wrapper">
		<div class="app-header">
			<h1>Horse Racing</h1>

			<race-controls />
		</div>

		<div class="main-content">
			<aside class="sidebar-left">
				<horse-list />
			</aside>

			<main class="center-area">
				<race-track />
			</main>

			<aside class="sidebar-right">
				<results-panel />
			</aside>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RaceControls from '@/components/RaceControls.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import ResultsPanel from '@/components/ResultsPanel.vue'
import HorseList from '@/components/HorseList.vue'

export default defineComponent({
	name: 'App',
	components: {
		RaceControls,
		RaceTrack,
		ResultsPanel,
		HorseList
	}
})
</script>

<style scoped>
@import "/node_modules/normalize.css/normalize.css";

* {
	box-sizing: border-box;
}

.app-wrapper {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	font-family: Arial, sans-serif;
	background: #f5f5f5;
}

.app-header {
	background: #ccc;
	padding: 16px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
	margin: 0;
	color: white;
	font-size: 24px;
}

.main-content {
	display: grid;
	grid-template-columns: 220px 1fr 300px;
	gap: 16px;
	padding: 16px;
	max-width: 1800px;
	margin: 0 auto;
	width: 100%;
}

.sidebar-left,
.sidebar-right {
	display: flex;
	flex-direction: column;
}

.center-area {
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
