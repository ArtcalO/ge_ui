<template>
	<v-progress-linear v-if="fetching" color="secondary" indeterminate></v-progress-linear>
	<div v-if="!fetching && !course_chapters">
		 <v-alert
	      :value="true"
	      type="warning"
	    >
	    Pas de chapitres disponible pour ce cours !. Veuillez attendre que l'administrateur puisse en ajouter.

	    </v-alert>
	</div>
	<div v-else>
		<div class="buttons-groups">
				<v-btn variant="outlined" v-if="is_prof | is_admin" color="primary" :to="'/chapitre/ajouter/'+$route.params.id">
					<ion-icon :src="getIcon('addOutline')"></ion-icon>
					Chapitre
				</v-btn>
				<v-btn
					small
					variant="outlined"
					v-if="is_prof | is_admin"
					color="secondary"
					:to="'/exercices/ajouter/'+current_chapter_id">
					<ion-icon :src="getIcon('addOutline')"></ion-icon>
					Exercice
				</v-btn>
				<v-btn
					v-if="is_prof | is_admin"
					variant="outlined"
					color="tertiary"
					:to="'/formules/ajouter/'+$route.params.id">
					<ion-icon :src="getIcon('addOutline')"></ion-icon>
					Formules
				</v-btn>
				<v-btn
					variant="outlined"
					v-if="is_prof | is_admin"
					color="tertiary"
					:to="'/chapitre/modifier/'+current_chapter_id">
					<ion-icon :src="getIcon('pencil')"></ion-icon>
					Modifier
				</v-btn>
				<v-btn
					v-if="current_course.nb_formules>0"
					variant="outlined"
					color="tertiary"
					:to="'/formules-details/'+$route.params.id">
					<ion-icon :src="getIcon('gridOutline')"></ion-icon>
					Formules
				</v-btn>
				<v-btn
					v-if="current_chapter && current_chapter.nb_exercices>0"
					variant="outlined"
					color="tertiary"
					:to="'/exercices/'+current_chapter_id">
					<ion-icon :src="getIcon('book')"></ion-icon>
					Exercices
				</v-btn>
			</div>
		<div class="top-header">
			<h2>{{current_chapter?current_chapter.nom:''}}</h2>
			
		</div>
		<div class="chapter-divider">
			<div class="table">
				<div class="table-container">
					<div v-html="current_chapter?current_chapter.note:''"></div>
				</div>
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
			course_chapters: [],current_course:[],
			current_chapter:[]
		};
	},
	methods: {
		fetchCourseChapter() {
			axios
				.get(`${this.url}/chapitres/?cour=${this.$route.params.id}`, this.headers)
				.then((res) => {
					this.course_chapters = res.data.results;
					this.current_chapter=this.course_chapters[0]
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.fetchCourseChapter);
				}).finally(()=>this.getClassCourses());
		},
		getClassCourses() {
			axios
				.get(`${this.url}/cours/${this.$route.params.id}/`, this.headers)
				.then((res) => {
					this.current_course = res.data;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getClassCourses);
				});
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_section = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/chapitres/${x.id}/`, this.headers)
				.then(() => {
					let id = this.chapitres.indexOf((i) => i.id === x.id);
					this.chapitres.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "chapitre supprimé avec succès",
					};
					setTimeout(() => {
						this.closeModal();
					}, 4000);
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.supprimer);
				});
		},
		changeChapter(item){
			this.current_chapter=item
			console.log(item)
		}

	},
	computed:{
		current_chapter_id(){
			let id=""
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
