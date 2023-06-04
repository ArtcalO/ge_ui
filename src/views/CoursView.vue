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
			<v-btn v-if="is_admin" color="primary" to="/cours/ajouter">
				<ion-icon :src="getIcon('addOutline')"></ion-icon>
				Ajouter
			</v-btn>
		</div>
		<div class="table">
			<div class="table-container">
				<v-table
					hover="true"
					density="compact"
				>
					<thead class="header-table">
						<tr>
							<th>Professeur</th>
							<th>Nom</th>
							<th>Classe</th>
							<th>Description</th>
							<th>Access rapide</th>
							<th v-if="is_admin" class="action">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="cour in filtered_courses" :key="cour.id" class="table-row" v-else>
							<td>{{ cour.professeur.user.username }}</td>
							<td>{{ cour.nom }}</td>
							<td>{{ cour.classe.classe_full_name }}</td>
							<td>{{ cour.description }}</td>
							<td>
								<v-btn
									class="btn btn-primary-alt"
									color="primary"
									@click="$router.push('/cours/chapitres/'+cour.id)"
								>Chapitres
							</v-btn>
							</td>
							<td v-if="is_admin">
								<v-menu>
									<template v-slot:activator="{ props }">
										<v-btn
											icon="mdi-dots-vertical"
											v-bind="props"
											size="small"
										></v-btn>
									</template>

									<v-list>
										<v-list-item @click="modifier(cour)">
											<v-list-item-title>
												<v-icon
													icon="mdi-square-edit-outline"
												></v-icon>
												Modifier</v-list-item-title
											>
										</v-list-item>
										<v-list-item
											@click="requestSupprimer(cour)"
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
			courses: [],
			filtered_courses:this.courses,
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	watch: {
		keyword(new_val){
			if(new_val){
				this.filtered_courses = this.courses.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_courses=this.courses
			}
		},
		courses(new_val){
			if(new_val){
				this.filtered_courses=new_val
			}
		}
	},
	methods: {
		getCours() {
			let query = ""
			if(this.user_is("Professeur"))
				query = `${this.url}/cours/?professeur=${this.$store.state.user.prof}`
			if(this.is_admin)
				query = `${this.url}/cours/`
			axios
				.get(query, this.headers)
				.then((res) => {
					this.courses = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getCours);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.courses[this.courses.indexOf(this.$store.state.current_cour)] =
					created;
			} else this.courses.unshift(created);
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_cour = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		Chapitre(x) {
			this.$store.state.current_cour = x;
			let modal = document.getElementById("chapitre");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/cours/${x.id}/`, this.headers)
				.then(() => {
					let id = this.cours.indexOf((i) => i.id === x.id);
					this.cours.splice(id, 1);
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
		search() {
			axios
				.get(`${this.url}/cours/?search=${this.keyword}`, this.headers)
				.then((res) => {
					this.cours = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.cours.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		this.getCours();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
