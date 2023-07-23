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
				to="/eleves/ajouter"
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
							v-for="eleve in filtered_eleves"
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
											@click="$router.push('/eleves/modifier/'+eleve.id)"
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
			eleves: [],
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
			filtered_eleves:[]
		}
	},
	watch: {
		keyword(new_val){
			if(new_val){
				this.filtered_eleves = this.eleves.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_eleves=this.eleves
			}
		},
		eleves(new_val){
			if(new_val){
				this.filtered_eleves=new_val
			}
		}
	},
	methods: {
		getEleves() {
			axios
				.get(`${this.url}/eleves/`, this.headers)
				.then((res) => {
					this.eleves = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getEleves);
				});
		},
		getClassEleves(id) {
			axios
				.get(`${this.url}/eleves/?classe=${id}`, this.headers)
				.then((res) => {
					this.eleves = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getEleves);
				});
		},
	},
	mounted() {
		if (this.is_directeur || this.is_econome) {
			if(this.$route.params.class_id)
				this.getClassEleves(this.$route.params.class_id)
			else
				this.getEleves()
		} else this.$router.push("/");
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
