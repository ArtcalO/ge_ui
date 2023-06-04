<template>

	<div v-if="course_chapters.length==0">
		 <v-alert
	      :value="true"
	      type="warning"
	    >
	      Pas de chapitres disponible pour ce cours !. Veuillez attendre que l'administrateur puisse en ajouter.
	    </v-alert>
	</div>
	<div v-else>
		<div class="buttons-groups">
				<v-btn
					color="primary"
					:to="'/chapitre-csp/ajouter/'+$route.params.id"
					v-if="is_prof | is_admin"
				>
					<ion-icon :src="getIcon('addOutline')"></ion-icon>
					Ajouter
				</v-btn>
				<v-btn
					small
					variant="outlined"
					v-if="is_prof | is_admin"
					color="secondary"
					:to="'/exercices-csp/ajouter/'+current_chapter_id">
					<ion-icon :src="getIcon('addOutline')"></ion-icon>
					Exercice
				</v-btn>
				<v-btn color="tertiary" to="/cours/ajouter">
					<ion-icon :src="getIcon('pencil')"></ion-icon>
					Modifier
				</v-btn>
				<v-btn color="tertiary" :to="'/exercices-csp/'+current_chapter_id">
					<ion-icon :src="getIcon('book')"></ion-icon>
					Exercices
				</v-btn>
			</div>
		<div class="top-header">
			<h2>{{current_chapter?current_chapter.nom:''}}</h2>
		</div>
		<div class="table">
			<div class="table-container">
				<div v-html="current_chapter?current_chapter.note:''"></div>
			</div>
			<div class="aside">	
		<div class="chapter-overview">
				<v-list density="compact" nav active-color="primary">
					<v-list-item
						v-for="item in course_chapters"
						:key="item.id"
						exact
						prepend-icon="mdi-home-city"
						:title="item.nom"
						@click="changeChapter(item)"
					></v-list-item>
				</v-list>
		</div>
			</div>
		</div>
		<confirm-delete :request="request" v-on:delete="supprimer" />
	</div>
</template>

<script>
import axios from "axios";
import ConfirmDelete from "@/components/confirmDelete.vue";
export default {
	components: {
		ConfirmDelete,
	},
	data() {
		return {
			course_chapters: [],
			current_chapter:[]
		};
	},
	methods: {
		fetchCourseChapter() {
			axios
				.get(`${this.url}/chapitres-csp/?cour=${this.$route.params.id}`, this.headers)
				.then((res) => {
					this.course_chapters = res.data.results;
					this.current_chapter=this.course_chapters[0]
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.fetchCourseChapter);
				});
		},
		changeChapter(item){
			this.current_chapter=item
			console.log(item)
		}

	},
	computed:{
		current_chapter_id(){
			let id = ""
			if(this.current_chapter)
				id=this.current_chapter.id
			return id
		}
	},
	mounted() {
		this.fetchCourseChapter();
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
.table{
	display:flex;
	flex-direction:row;
	justify-content:space-between;
}
.aside{
	width:35%;
	box-shadow: 2px 2px 4px #000000;
}
</style>
