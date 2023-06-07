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
				to="/personnels/ajouter"
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
							v-for="professeur in personnels"
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
											@click="$router.push('/personnels/modifier/'+professeur.id)"
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
			personnels: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getpersonnels() {
			axios
				.get(`${this.url}/personnels/`, this.headers)
				.then((res) => {
					this.personnels = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.personnels.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getpersonnels);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.personnels[
					this.personnels.indexOf(this.$store.state.current_teacher)
				] = created;
			} else this.personnels.unshift(created);
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/personnels/${x.id}/`, this.headers)
				.then(() => {
					let id = this.personnels.indexOf((i) => i.id === x.id);
					this.personnels.splice(id, 1);
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
			this.getpersonnels()
		} else this.$router.push("/");
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
