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
				to="/entrees/ajouter"
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
							<th>Nom</th>
							<th>Prenom</th>
							<th>Genre</th>
							<th>Date de naissance</th>
							<th>Classe</th>
							<th class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr
							v-for="eleve in entrees"
							:key="eleve.id"
							v-else
						>
							<td>{{ eleve.nom }}</td>
							<td>{{ eleve.prenom }}</td>
							<td>{{ eleve.genre }}</td>
							<td>{{ eleve.date_naissance }}</td>
							<td>{{ eleve.classe.classe_full_name }}</td>
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
											@click="$router.push('/entrees/modifier/'+eleve.id)"
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
			entrees: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getEntrees() {
			axios
				.get(`${this.url}/entrees/`, this.headers)
				.then((res) => {
					this.entrees = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getEntrees);
				});
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/entrees/${x.id}/`, this.headers)
				.then(() => {
					let id = this.entrees.indexOf((i) => i.id === x.id);
					this.entrees.splice(id, 1);
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
	},
	mounted() {
		if (this.is_directeur) {
			this.getEntrees()
		} else this.$router.push("/");
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
