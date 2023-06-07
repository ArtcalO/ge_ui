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
				to="/niveaux/ajouter"
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
							<th class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="niveau in niveaus" :key="niveau.id" v-else>
							<td>{{ niveau.nom }}</td>
							<td class="text-center">
								<v-menu location="left top">
									<template v-slot:activator="{ props }">
										<v-btn
											icon="mdi-dots-vertical"
											v-bind="props"
											size="small"
											rounded="2"
										></v-btn>
									</template>

									<v-list density="compact">
										<v-list-item
											@click="Cycle(niveau)"
											v-if="niveau.nom == 'Fondamental'"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-plus"
												></v-icon>
												Cycle</v-list-item-title
											>
										</v-list-item>
										<v-list-item
											@click="Section(niveau)"
											v-if="
												niveau.nom == 'Post Fondamental'
											"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-square-edit-outline"
												></v-icon>
												Section</v-list-item-title
											>
										</v-list-item>
										
										<v-list-item @click="modifier(niveau.id)">
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
			niveaus: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getNiveaus() {
			axios
				.get(`${this.url}/niveaux/`, this.headers)
				.then((res) => {
					this.niveaus = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getNiveaus);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.niveaus[
					this.niveaus.indexOf(this.$store.state.current_niveau)
				] = created;
			} else this.niveaus.unshift(created);
		},
		modifier(x) {
			this.$router.push("/niveaux/modifier/"+x)
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		Section(x) {
			this.$store.state.current_niveau = x;
			let modal = document.getElementById("section");
			modal.showModal();
		},
		Cycle(x) {
			this.$store.state.current_niveau = x;
			let modal = document.getElementById("cycle");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/niveaux/${x.id}/`, this.headers)
				.then(() => {
					let id = this.niveaus.indexOf((i) => i.id === x.id);
					this.niveaus.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Niveau supprimé avec succès",
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
				.get(`${this.url}/niveaux/?search=${this.keyword}`, this.headers)
				.then((res) => {
					this.niveaus = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},

	},
	mounted() {
		if (!this.is_directeur) {
			this.$router.push("/");
		} else this.getNiveaus();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
