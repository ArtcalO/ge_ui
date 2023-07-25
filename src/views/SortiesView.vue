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
			<v-text-field
				variant="outlined"
				density="compact"
				label="Du"
				v-model="du"
				type="date"
				required
				style="max-width: 150px;max-height:40px"
			></v-text-field>
			<v-text-field
				variant="outlined"
				density="compact"
				label="Au"
				v-model="au"
				type="date"
				required
				style="max-width: 150px;max-height:40px"
			></v-text-field>
			<v-btn
				@click="exportCsv(filtered_entrees)"
				color="primary"
				class="btn btn-primary"
			>
				<ion-icon :src="getIcon('addOutline')"></ion-icon>
				Exporter
			</v-btn>
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
					fixed-header
					hover="true"
					density="compact"
				>
					<thead class="header-table">
						<tr>
							<th>Type Entree</th>
							<th>Montant</th>
							<th>Details</th>
							<th>Date</th>
							<th>Utilisateur</th>
							<!-- <th class="action text-center">Actions</th> -->
						</tr>
					</thead>
					<tbody>
						<tr v-if="$store.state.loading">
							<td colspan="6"></td>
						</tr>
						<tr
							v-for="entree in filtered_entrees"
							:key="entree.id"
							v-else
						>
							<td>{{ getEntreeType(entree.type_entree) }}</td>
							<td>{{  money(entree.montant) }}</td>
							<td>{{ entree.details }}</td>
							<td>{{ entree.date }}</td>
							<td>{{ entree.user.first_name+' '+entree.user.last_name }}</td>
							<!-- <td class="text-center">
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
							</td> -->
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td>Total</td>
							<td>{{money(filtered_entrees.reduce((sum,el)=>sum+parseInt(el.montant),0))}} Fbu</td>
						</tr>
					</tfoot>
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
			du:"",
			au:"",
			filtered_entrees:[]
		};
	},
	watch: {
		au(new_val){
			if(this.du && new_val){
				this.getEntrees()
			}
		},
		keyword(new_val){
			if(new_val){
				this.filtered_entrees = this.entrees.filter( x => {
					return  JSON.stringify(x).toLowerCase().includes(new_val.toLowerCase())
				})
			}else{
				this.filtered_entrees=this.entrees
			}
		},
		entrees(new_val){
			if(new_val){
				this.filtered_entrees=new_val
			}
		}
	},
	methods: {
		getEntrees(){
			let link=`${this.url}/entrees/?type_entree=&date__gte=${this.du}&date__lte=${this.au}`
			axios
				.get(link, this.headers)
				.then((res) => {
					this.entrees = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getEntrees);
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
