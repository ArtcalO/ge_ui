<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<v-form @submit.prevent="performAction" class="form">
					<v-autocomplete
						variant="outlined"
						label="Type Entrée"
						:items="TYPES_ENTREES"
						item-title="[0]"
						item-value="[1]"
						v-model="type_entree"
						required
					></v-autocomplete>
					<v-text-field
						variant="outlined"
						label="Montant"
						v-model="montant"
					></v-text-field>
					<v-text-field
						variant="outlined"
						label="Details"
						v-model="details"
						required
					></v-text-field>
					<v-btn v-if="$route.params.id" class="btn btn-primary" type="submit"
						>Modifier</v-btn
					>
					<v-btn v-else class="btn btn-primary-alt" type="submit"
						>Enregistrer</v-btn
					>
				</v-form>
			</v-col>
			<v-col cols="auto"></v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2'
export default {
	props: ["edit"],
	data() {
		return {
			entree_actif:[],
			type_entree: "",
			montant: "",
			details: "",
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/entrees/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.entree_actif=res.data
			}).catch((err)=>{
				console.log(erro)
			}).finally(()=>{
				this.type_entree =
					this.entree_actif.type_entree;
				this.montant =
					this.entree_actif.montant;
				this.details =
					this.entree_actif.details;
			})
			
		}
	},
	computed:{
		TYPES_ENTREES(){
			return Object.entries(this.$store.state.TYPES_ENTREES)
		},
	},
	methods: {
		performAction() {
			let data = new FormData();
			data.append("type_entree", this.type_entree);
			data.append("montant", this.montant);
			data.append("details", this.details);

			this.$store.state.loading = true;
			if (this.$route.params.id) {
				axios
					.patch(
						`${this.url}/entrees/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$router.push('/entrees')
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Eleve modifié avec success !',
							footer: 'Success'
						})
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.performAction);
					});
			} else {
				axios
					.post(`${this.url}/entrees/`, data, this.headers)
					.then((res) => {
						this.$router.push("/entrees");
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Entree ajouté avec succès !',
							footer: 'Success'
						})
					})
					.catch((err) => {
						console.log(err)
							this.displayErrorOrRefreshToken(err,this.performAction);
					})
					
			}
		},
		getClasses() {
			axios
			.get(`${this.url}/entrees/`, this.headers)
			.then((res) => {
				this.classes = res.data.results;
			})
			.catch((err) => {
				this.displayErrorOrRefreshToken(err,this.getClasses);
			})
		},
		clearInputs() {
			this.nom = "";
			this.prenom = "";
			this.genre = "";
			this.date_naissance = "";
			this.classe = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
	},
};
</script>

<style scoped></style>
