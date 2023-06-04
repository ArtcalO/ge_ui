<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">Ajouter un cours spécial</h2>
				<v-form @submit.prevent="Post" class="form">
					<v-text-field
						label="Nom du cours"
						v-model="nom"
						required
					></v-text-field>
					<v-autocomplete
						label="Categories"
						:items="categories"
						item-title="nom"
						item-value="id"
						v-model="categorie"
						required
					></v-autocomplete>
					<v-textarea
						label="Description du cours"
						v-model="description"
					></v-textarea>
					<v-btn type="submit" class="btn btn-blue"
						>Enregistrer</v-btn
					>
				</v-form>
			</v-col>
			<v-col cols="3">
				<h4></h4>
			</v-col>
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
			categories: [],
			categorie:null,
			classe: "",
			nom: "",
			description: "",
		};
	},
	methods: {
		Post() {
			let data = {
				categorie: this.categorie,
				nom: this.nom,
				description: this.description,
			};
			if (this.edit) {
				axios
					.patch(
						`${this.url}/cours-speciaux/${this.$store.state.current_cour.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$emit("close");
						this.closeModal();
						this.successAllert({
							body: "Cours modifiée avec succès",
						});
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.Post);
					});
			} else {
				axios
					.post(`${this.url}/cours-speciaux/`, data, this.headers)
					.then(() => {
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Cours ajouté avec succès !',
							footer: 'Success'
						})
						this.$router.go(-1)
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.Post);
					});
			}
		},
		clearInputs() {
			this.classe = "";
			this.nom = "";
			this.description = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
		getClasses() {
			axios
				.get(`${this.url}/categories/`, this.headers)
				.then((res) => {
					this.categories = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err,this.getClasses);
				});
		},
	},
	mounted() {
		this.getClasses();
	},
};
</script>

<style scoped></style>
