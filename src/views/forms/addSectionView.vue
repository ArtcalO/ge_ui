<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">{{header}}</h2>
				<v-form @submit.prevent="Post" class="form">
					<v-text-field label="Nom" v-model="nom"></v-text-field>
					<v-autocomplete
						label="Niveau"
						:items="niveaux"
						item-title="nom"
						item-value="id"
						v-model="niveau"
					></v-autocomplete>

					<v-btn class="btn btn-blue" type="submit">
						{{btn}}
					</v-btn>
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
			nom: "",
			niveau: "",
			niveaux: [],
			header:"Ajouter section",
			btn:"Enregistrer",
			current_section:null
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/sections/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.current_section=res.data
			}).catch((err)=>{
				console.log(err)
			}).finally(()=>{
				this.header = "Modifier section"
				this.btn = "Modifier"
				this.nom = this.current_section.nom;
				this.niveau = this.current_section.niveau.id;
			})
			
		}
	},
	methods: {
		Post() {
			let data = {
				nom: this.nom,
				niveau: this.niveau,
			};
			if(this.$route.params.id) {
				axios
					.patch(
						`${this.url}/sections/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then(() => {
						Swal.fire({
								icon: 'success',
								title: 'Success...',
								text: 'Section modifiée avec success !',
							}).then(()=>{
								this.$router.go(-1)
							})
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
						})
			} else {
				axios
					.post(`${this.url}/sections/`, data, this.headers)
					.then((res) => {
						this.$emit("update", res.data);
						this.closeModal();
						this.successAllert({
							body: "Section ajoutée avec succès",
						});
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
					})
			}
		},
		getNiveaux() {
			axios
				.get(`${this.url}/niveaux/`, this.headers)
				.then((res) => {
					this.niveaux = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getNiveaux);
				});
		},
		clearInputs() {
			this.nom = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
	},
	mounted() {
		this.getNiveaux();
	},
};
</script>

<style scoped></style>
