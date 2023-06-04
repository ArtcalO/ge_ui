<template>
	<div v-if="formule">
		<div class="top-header">
			<h2>Formules {{course}}</h2>
			
		</div>
		<div class="chapter-divider">
			<div class="table">
				<div v-for="item in formule" :key="item.id" class="table-container">
					<div v-html="item.formules"></div>
				</div>
			</div>
		</div>
	</div>
	<div v-else>Searching...</div>
</template>

<script>
import axios from "axios";
export default {
	data() {
		return {
			formule: [],
			course:""
		};
	},
	methods: {
		fetchCourseFormules() {
			axios
				.get(`${this.url}/formules/?cour=${this.$route.params.id}`, this.headers)
				.then((res) => {
					this.formule = res.data.results
					this.course=res.data.results[0].cour
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.fetchCourseFormules);
				});
		},
	},
	mounted() {
		this.fetchCourseFormules();
	},
};
</script>

<style scoped>
.top-header{
	margin-bottom:40px;
}
.table {
	margin-top: 10px;
}
.table-container{
	padding:0 25px;
	width:100%;
}
.chapter-divider{
	display:flex;
	flex-direction:row;
	justify-content:flex-start;
}

.aside{
	width:35%;
}
.chapter-overview{
	height:auto;
	box-shadow: 2px 2px 4px #000000;
}
</style>
