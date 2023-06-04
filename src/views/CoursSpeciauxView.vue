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
			<v-btn color="primary" v-if="is_admin" to="/cours-speciaux/ajouter">
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
							<th>Cours</th>
							<th>Categorie</th>
							<th>Description</th>
							<th>Chapitres</th>
							<th v-if="user_is('Professeur')" class="action">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="cour in cours" :key="cour.id" v-else>
							<td>{{ cour.nom }}</td>
							<td>{{ cour.categorie }}</td>
							<td>{{ cour.description }}</td>
							<td>
									<v-btn
									class="btn btn-primary-alt"
									color="primary"
									:to="'/cours-speciaux/chapitres/'+cour.id"
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
			cours: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getCours() {
			axios
				.get(`${this.url}/cours-speciaux/`, this.headers)
				.then((res) => {
					this.cours = res.data.results
					this.pages = this.pagination(
						res.data.count,
						this.cours.length
					);
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getCours);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.cours[this.cours.indexOf(this.$store.state.current_cour)] =
					created;
			} else this.cours.unshift(created);
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
				.delete(`${this.url}/cours-speciaux/${x.id}/`, this.headers)
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
		if(this.cours.length==0)
			this.getCours();
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
