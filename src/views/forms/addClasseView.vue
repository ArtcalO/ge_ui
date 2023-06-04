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
					<v-autocomplete
						label="Section"
						:items="sections"
						item-title="nom"
						item-value="id"
						v-model="section"
						v-if="niveau != 2"
					></v-autocomplete>
					<v-btn color="secondary" type="submit"
						>{{btn}}</v-btn
					>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
export default {
	data() {
		return {
			niveau: "",
			section: "",
			nom: "",
			current_classe:null,
			niveaux: [],
			header:"Enregistrer classe",
			btn:"Enregistrer",
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/classes/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.current_classe=res.data
			}).catch((err)=>{
				console.log(err)
			}).finally(()=>{
				this.header = "Modifier niveau"
				this.btn = "Modifier"
				this.nom = this.current_classe.nom;
				this.niveau = this.current_classe.niveau.id;
				this.section = this.current_classe.section.id;
			})
			
		}
	},
	methods: {
		Post() {
			let data = {
				nom: this.nom,
				niveau: this.niveau,
				section: this.section,
			};
			if (this.$route.params.id) {
				axios
					.patch(
						`${this.url}/classes/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						Swal.fire({
								icon: 'success',
								title: 'Success...',
								text: 'Classe modifié avec success !',
							}).then(()=>{
								this.$router.go(-1)
							})
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
					})
			} else {
				axios
					.post(`${this.url}/classes/`, data, this.headers)
					.then(() => {
						Swal.fire({
									icon: 'success',
									title: 'Success...',
									text: 'Classe ajouté avec success !',
								}).then(()=>{
									this.$router.go(-1)
								})
						})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
					});
			}
		},
		clearInputs() {
			this.nom = "";
			this.niveau = "";
			this.section = "";
		},
		getniveaux() {
			axios
				.get(`${this.url}/niveaux/`, this.headers)
				.then((res) => {
					this.niveaux = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getniveaux);
				});
		},
		getSections() {
			axios
				.get(`${this.url}/sections/`, this.headers)
				.then((res) => {
					this.sections = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getSections);
				});
		},
	},
	mounted() {
		this.getSections();
		this.getniveaux();
	},
};
</script>

<style scoped></style>
