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
				to="/enfants/ajouter"
				v-if="is_parent"
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
							<th>Nom</th>
							<th>Prenom</th>
							<th>Genre</th>
							<th>Naissance</th>
							<th>Classe</th>
							<th v-if="is_parent" class="action text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr v-for="child in filtered_child" :key="child.id" v-else>
							<td>{{ child.first_name }}</td>
							<td>{{ child.last_name }}</td>
							<td>{{ child.genre }}</td>
							<td>{{ child.date_naissance }}</td>
							<td>{{ child.classe.nom }} {{ child.classe.niveau.nom }}</td>
							<td class="text-center" v-if="is_parent">
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
											@click="requestSupprimer(child)"
										>
											<v-list-item-title>
												<v-icon
													icon="mdi-delete"
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
			child: [],
			filtered_child: this.child,
			keyword: "",
			edit: false,
			request: {},
			searching: false,
			pages: 0,
		};
	},
	watch: {
		keyword(new_val){
			if(new_val){
				this.filtered_child = this.child.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_child=this.child
			}
		},
		child(new_val){
			if(new_val){
				this.filtered_child=new_val
			}
		}
	},
	methods: {
		getChildren() {
			axios
				.get(`${this.url}/eleves/?parent=${this.user.parent_id}`, this.headers)
				.then((res) => {
					this.child = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getChildren);

				});
		},
		getCreated(created) {
			if (this.edit) {
				this.classes[
					this.classes.indexOf(this.$store.state.current_classe)
				] = created;
			} else this.classes.unshift(created);
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_classe = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		requestModifier(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
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
					this.pages = this.pagination(
						res.data.count,
						this.classes.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		if (this.is_parent) this.getChildren()
		else this.$router.push("/"); 
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
</style>
