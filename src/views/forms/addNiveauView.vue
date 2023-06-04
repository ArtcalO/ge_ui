<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">{{header}}</h2>
				<v-form @submit.prevent="Post" class="form">
					<v-text-field label="Nom" v-model="nom"></v-text-field>
					<v-btn class="btn btn-blue" type="submit"
						>{{btn}}</v-btn
					>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2'
export default {
	data() {
		return {
			nom: "",current_niveau:null,header:"Ajouter un niveau",btn:"Enregistrer"
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/niveaux/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.current_niveau=res.data
			}).catch((err)=>{
				console.log(err)
			}).finally(()=>{
				this.header = "Modifier niveau"
				this.btn = "Modifier"
				this.nom = this.current_niveau.nom;
			})
			
		}
	},
	methods: {
		Post() {
			let data = {
				nom: this.nom,
			};
			if (this.$route.params.id) {
				axios
					.patch(
						`${this.url}/niveaux/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then((res) => {
							Swal.fire({
								icon: 'success',
								title: 'Success...',
								text: 'Niveau modifié avec success !',
							}).then(()=>{
								this.$router.go(-1)
							})
					})
					.catch((err) => {
						console.log(err)
					})
			} else {
				axios
					.post(`${this.url}/niveaux/`, data, this.headers)
					.then((res) => {
						Swal.fire({
								icon: 'success',
								title: 'Success...',
								text: 'Niveau ajoutée avec succès !',
							}).then(()=>{
								this.$router.go(-1)
							})
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.Post);
					});
			}
		},
		clearInputs() {
			this.nom = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
	},
};
</script>

<style scoped></style>
