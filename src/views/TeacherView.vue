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
				to="/professeurs/ajouter"
				color="primary"
				class="btn btn-primary"
			>
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
							<th>Username</th>
							<th>Nom</th>
							<th>Prenom</th>
							<th>Telephone</th>
							<th>Genre</th>
							<th class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr
							v-for="professeur in professeurs"
							:key="professeur.id"
							v-else
						>
							<td>{{ professeur.user.username }}</td>
							<td>{{ professeur.user.first_name }}</td>
							<td>{{ professeur.user.last_name }}</td>
							<td>{{ professeur.telephone }}</td>
							<td>{{ professeur.genre }}</td>
							<td class="text-center">
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
											@click="$router.push('/professeurs/modifier/'+professeur.id)"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-square-edit-outline"
												></v-icon>
												Modifier</v-list-item-title
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
			professeurs: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getProfesseurs() {
			axios
				.get(`${this.url}/professeurs/`, this.headers)
				.then((res) => {
					this.professeurs = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.professeurs.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getProfesseurs);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.professeurs[
					this.professeurs.indexOf(this.$store.state.current_teacher)
				] = created;
			} else this.professeurs.unshift(created);
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		Cours(x) {
			this.$store.state.current_teacher = x;
			let modal = document.getElementById("cours");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/professeurs/${x.id}/`, this.headers)
				.then(() => {
					let id = this.professeurs.indexOf((i) => i.id === x.id);
					this.professeurs.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Professeur supprimé avec succès",
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
			this.searching = true;
			axios
				.get(
					`${this.url}/professeurs/?search=${this.keyword}`,
					this.headers
				)
				.then((res) => {
					this.professeurs = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.professeurs.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				})
				.finally(() => {
					this.$store.state.loading = false;
				});
		},
	},
	mounted() {
		if (this.user_is("Professeur")) {
			this.$router.push("/");
		} else this.getProfesseurs();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
