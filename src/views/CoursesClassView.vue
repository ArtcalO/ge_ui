<template>
	<div>
		<div class="top-header">
			<v-text-field
				:loading="searching"
				density="compact"
				variant="solo"
				label="Chercher nom"
				append-inner-icon="mdi-magnify"
				single-line
				hide-details
				@click:append-inner="search"
				@keypress.enter="search"
				v-model="keyword"
				style="max-width: 300px"
			></v-text-field>
			<v-btn
				class="btn btn-primary-alt"
				color="primary"
				v-if="is_admin"
				:to="'/cours/ajouter/'+$route.params.id"
			>
				<ion-icon :src="getIcon('addOutline')"></ion-icon>
				Ajouter Cours
			</v-btn>
		</div>
		<div v-if="!fetching && !filtered_class_courses">
			 <v-alert
		      :value="true"
		      type="warning"
		    >
		    Pas de chapitres disponible pour ce cours !. Veuillez attendre que l'administrateur puisse en ajouter.

		    </v-alert>
		</div>
		<v-progress-linear v-if="fetching" color="secondary" indeterminate></v-progress-linear>
		<div class="table">
			<div class="table-container">
				<v-table
					hover="true"
					density="compact"
				>
					<thead>
						<tr>
							<th>Cours</th>
							<th>Description</th>
							<th>Details</th>
							<th v-if="is_admin" class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="course in filtered_class_courses" :key="course.id" >
							<td>{{ course.nom }}</td>
							<td>{{ course.description }}</td>
							<td >
									<v-btn
									class="btn btn-primary-alt"
									color="primary"
									@click="$router.push('/cours/chapitres/'+course.id)"
								>Voir Chapitres
								</v-btn>
								<!-- <v-btn
										class="btn btn-primary-alt"
										color="secondary"
										@click="$router.push('/exercices/'+course.id)"
									>Exercices
								</v-btn> -->
							</td>
							<td v-if="is_admin" class="text-center">
								<v-menu>
									<template v-slot:activator="{ props }">
										<v-btn
											icon="mdi-dots-vertical"
											v-bind="props"
											size="small"
										></v-btn>
									</template>

									<v-list>
										<v-list-item
											@click="requestSupprimer(classe)"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-delete"
												></v-icon>
												Supprimer</v-list-item-title
											>
										</v-list-item>
									</v-list>
								</v-menu>
							</td>
						</tr>
					</tbody>
				</v-table>
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
			class_courses: [],
			filtered_class_courses: this.class_courses,
			keyword:"",fetching:false
		};
	},
	watch: {
		keyword(new_val){
			if(new_val){
				this.filtered_class_courses = this.class_courses.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_class_courses=this.class_courses
			}
		},
		class_courses(new_val){
			if(new_val){
				this.filtered_class_courses=new_val
			}
		}
	},
	methods: {
		getClassCourses() {
			this.fetching=true
			axios
				.get(`${this.url}/cours/?classe=${this.$route.params.id}`, this.headers)
				.then((res) => {
					this.class_courses = res.data.results;
					this.fetching=false
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getClassCourses);
				});
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/cours/${x.id}/`, this.headers)
				.then(() => {
					let id = this.class_courses.indexOf((i) => i.id === x.id);
					this.class_courses.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "cour supprimé avec succès",
					};
					setTimeout(() => {
						this.closeModal();
					}, 4000);
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.supprimer);
				});
		},
	},
	mounted() {
		if (this.user_is("Professeur")) {
			this.$router.push("/");
		} else this.getClassCourses();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
.buttons-groups{
	display:flex;
}
.buttons-groups>*{
	margin-right:10px;
}
</style>
