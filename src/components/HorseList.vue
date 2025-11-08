<template>
	<div class="horse-list">
		<h3 class="title">Horse List (1-20)</h3>

		<table v-if="horses.length" class="horses-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Condition</th>
					<th>Color</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="horse in horses" :key="horse.id">
					<td>{{ horse.name }}</td>
					<td>{{ horse.condition }}</td>
					<td>
						<div class="color-box" :style="{ backgroundColor: horse.color }"></div>
					</td>
				</tr>
			</tbody>
		</table>

		<div v-else class="no-horse-list">No horses list yet</div>
	</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from '@/hooks/useStore'

export default defineComponent({
	name: 'HorseList',
	setup() {
		const store = useStore()

		const horses = computed(() => {
			return store.state.horses
		})

		return { horses }
	}
})
</script>

<style scoped>
.horse-list {
	background: #fff9e6;
	padding: 12px;
	border-radius: 8px;
	height: fit-content;
}

.title {
	margin: 0 0 12px 0;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	background: #ffd700;
	padding: 8px;
	border-radius: 4px;
}

.horses-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.horses-table th {
	background: #ffd700;
	padding: 6px 8px;
	text-align: left;
	font-weight: bold;
	border: 1px solid #daa520;
}

.horses-table td {
	padding: 4px 8px;
	border: 1px solid #ddd;
	background: white;
}

.color-box {
	width: 30px;
	height: 20px;
	border: 1px solid #333;
	border-radius: 3px;
}

.no-horse-list {
	font-size: 12px;
	text-align: center;
	padding: 10px 0;
}
</style>
