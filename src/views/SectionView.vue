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
				to="/sections/ajouter"
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
							<th>Nom Section</th>
							<th>Niveau</th>
							<th class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="100%"></td>
						</tr>
						<tr
							v-for="section in sections"
							:key="section.id"
							v-else
						>
							<td>{{ section.nom }}</td>
							<td>{{ section.niveau.nom }}</td>
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
										<v-list-item @click="modifier(section.id)">
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
			sections: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	methods: {
		getSections() {
			axios
				.get(`${this.url}/sections/`, this.headers)
				.then((res) => {
					this.sections = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getSections);
				});
		},
		getCreated(created) {
			if (this.edit) {
				this.sections[
					this.sections.indexOf(this.$store.state.current_section)
				] = created;
			} else this.sections.unshift(created);
		},
		Cours(x) {
			this.$store.state.current_classe = x;
			let modal = document.getElementById("cours");
			modal.showModal();
		},
		modifier(x) {
			this.$router.push("/sections/modifier/"+x)
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/sections/${x.id}/`, this.headers)
				.then(() => {
					let id = this.sections.indexOf((i) => i.id === x.id);
					this.sections.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Section supprimé avec succès",
					};
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.supprimer);
				});
		},
	},
	mounted() {
		if (!this.is_directeur) {
			this.$router.push("/");
		} else this.getSections();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
