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
							<th>Cours</th>
							<th>Nom</th>
							<th>Note</th>
							<th>Resume</th>
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
							v-for="chapitre in chapitres"
							:key="chapitre.id"
							v-else
						>
							<td>{{ chapitre.cour.nom }}</td>
							<td>{{ chapitre.nom }}</td>
							<td>{{ chapitre.note }}</td>
							<td>{{ chapitre.resume }}</td>
							<td v-if="user_is('Professeur')">
								<div class="act">
									<button
										class="btn-sm btn-blue"
										@click="modifier(chapitre)"
									>
										<ion-icon
											:src="getIcon('createOutline')"
										></ion-icon>
										Modifier
									</button>
									<button
										class="btn-sm btn-danger"
										@click="requestSupprimer(chapitre)"
									>
										<ion-icon
											:src="getIcon('trashOutline')"
										>
										</ion-icon>
										Supprimer
									</button>
								</div>
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
			chapitres: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getChapitres() {
			axios
				.get(`${this.url}/chapitres/`, this.headers)
				.then((res) => {
					this.chapitres = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.chapitres.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getChapitres);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.chapitres[
					this.chapitres.indexOf(this.$store.state.current_section)
				] = created;
			} else this.chapitres.unshift(created);
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
		search() {
			axios
				.get(
					`${this.url}/chapitres/?search=${this.keyword}`,
					this.headers
				)
				.then((res) => {
					this.chapitres = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.chapitres.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		this.getChapitres();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
