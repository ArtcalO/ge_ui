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
		</div>
		<div class="table">
			<div class="table-container">
				<v-table
					hover="true"
					density="compact"
				>
					<thead>
						<tr>
							<th>Chapitre</th>
							<th>Question</th>
							<th>Access rapide</th>
							<th v-if="user_is('Professeur')" class="action">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr
							v-for="exercice in exercices"
							:key="exercice.id"
							v-else
						>
							<td>{{ exercice.chapitre.nom }}</td>
							<td>{{ exercice.question }}</td>
							<td>
								<v-btn
									class="btn btn-primary-alt"
									color="primary"
									@click="$router.push('/cours/chapitres/'+course.id)"
								>Voir Chapitres
							</v-btn>
							</td>
							<td v-if="user_is('Professeur')">
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
											@click="modifier(exercice)"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-square-edit-outline"
												></v-icon>
												Modifier</v-list-item-title
											>
										</v-list-item>
										<v-list-item
											@click="requestSupprimer(exercice)"
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
			exercices: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getExercices() {
			axios
				.get(`${this.url}/exercices/`, this.headers)
				.then((res) => {
					this.exercices = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.exercices.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getExercices);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.exercices[
					this.exercices.indexOf(this.$store.state.current_exercice)
				] = created;
			} else this.exercices.unshift(created);
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_exercice = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/exercices/${x.id}/`, this.headers)
				.then(() => {
					let id = this.exercices.indexOf((i) => i.id === x.id);
					this.exercices.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Exercice supprimé avec succès",
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
				.get(
					`${this.url}/exercices/?search=${this.keyword}`,
					this.headers
				)
				.then((res) => {
					this.exercices = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.exercices.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		this.getExercices();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
