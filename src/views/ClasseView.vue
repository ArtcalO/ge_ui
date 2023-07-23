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
				to="/classes/ajouter"
				v-if="is_directeur"
			>
				<ion-icon :src="getIcon('addOutline')"></ion-icon>
				Ajouter
			</v-btn>
		</div>
		<v-progress-linear v-if="fetching" color="secondary" indeterminate></v-progress-linear>
		<div class="table">
			<div class="table-container">
				<v-table
					hover="true"
					density="compact"
				>
					<thead class="header-table">
						<tr>
							<th>Classe</th>
							<th>Niveau</th>
							<th>Section</th>
							<th>Cours</th>
							<th v-if="is_directeur" class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="classe in filtered_classes" :key="classe.id" v-else>
							<td>{{ classe.nom }}</td>
							<td>{{ classe.niveau.nom }}</td>
							<td>{{ classe.section.nom?classe.section.nom:'Pas de section' }}</td>
							<td>
								<v-btn
									class="btn btn-primary-alt"
									color="primary"
									@click="$router.push('/eleves/'+classe.id)"
								>Voir Eleves
								</v-btn>
							</td>
							<td class="text-center" v-if="is_directeur">
								<v-menu>
									<template v-slot:activator="{ props }">
										<v-btn
											icon="mdi-dots-vertical"
											v-bind="props"
											size="small"
										></v-btn>
									</template>

									<v-list
										density="compact"
									>
										<v-list-item
											@click="requestModifier(classe.id)"
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
			classes: [],
			filtered_classes: this.classes,
			keyword: "",
			edit: false,
			request: {},
			fetching: false,
			pages: 0,
			next:null,
		};
	},
	watch: {
		keyword(new_val){
			if(new_val){
				this.filtered_classes = this.classes.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_classes=this.classes
			}
		},
		classes(new_val){
			if(new_val){
				this.filtered_classes=new_val
			}
		}
	},
	methods: {
		getClasses(){
			this.fetching=true
			let link = `${this.url}/classes/`
			axios.get(link, this.headers)
			.then((response) => {
				this.classes = response.data.results
				this.fetching=false
			}).catch((error) => {
				this.fetching=false
				this.displayErrorOrRefreshToken(error, this.getClasses)
			})
		},
		getCreated(created) {
			if (this.edit) {
				this.classes[
					this.classes.indexOf(this.$store.state.current_classe)
				] = created;
			} else this.classes.unshift(created);
		},
		requestModifier(id) {
			this.$router.push("/classes/modifier/"+id)
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/classes/${x.id}/`, this.headers)
				.then(() => {
					let id = this.classes.indexOf((i) => i.id === x.id);
					this.classes.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Classe supprimé avec succès",
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
				.get(`${this.url}/classes/?search=${this.keyword}`, this.headers)
				.then((res) => {
					this.classes = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		this.getClasses();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
