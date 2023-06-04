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
				color="primary"
				class="btn btn-primary-alt"
				to="/cycles/ajouter"
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
					<thead>
						<tr>
							<th>Niveau</th>
							<th>Nom</th>
							<th class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="cycle in cycles" :key="cycle.id" v-else>
							<td>{{ cycle.niveau.nom }}</td>
							<td>{{ cycle.nom }}</td>
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
										<v-list-item @click="modifier(cycle)">
											<v-list-item-title>
												<v-icon
													icon="mdi-square-edit-outline"
												></v-icon>
												Modifier</v-list-item-title
											>
										</v-list-item>
										<v-list-item
											@click="requestSupprimer(cycle)"
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
			cycles: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getCycles() {
			axios
				.get(`${this.url}/cycles/`, this.headers)
				.then((res) => {
					this.cycles = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.cycles.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getCycles);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.cycles[
					this.cycles.indexOf(this.$store.state.current_niveau)
				] = created;
			} else this.cycles.unshift(created);
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_niveau = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/cycles/${x.id}/`, this.headers)
				.then(() => {
					let id = this.cycles.indexOf((i) => i.id === x.id);
					this.cycles.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Cycle supprimé avec succès",
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
				.get(`${this.url}/cycles/?search=${this.keyword}`, this.headers)
				.then((res) => {
					this.cycles = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.cycles.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		if (this.user_is("Professeur")) {
			this.$router.push("/");
		} else this.getCycles();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
