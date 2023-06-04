<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">Ajouter un cours</h2>
				<v-form @submit.prevent="Post" class="form">
					<v-autocomplete
						label="Professeur"
						:items="professeurs"
						item-title="user.username"
						item-value="id"
						v-model="professeur"
						required
					></v-autocomplete>
					<v-text-field
						label="Nom du cours"
						v-model="nom"
						required
					></v-text-field>
					<v-textarea
						label="Description"
						v-model="description"
					></v-textarea>
					<v-btn type="submit" color="secondary"
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
import Swal from 'sweetalert2'
import axios from "axios";
export default {
	props: ["edit"],
	data() {
		return {
			classes: [],
			professeurs: [],
			classe: "",
			professeur: "",
			nom: "",
			description: "",
		};
	},
	methods: {
		Post() {
			let data = {
				classe: this.$route.params.id,
				nom: this.nom,
				description: this.description,
				professeur: this.professeur
			};
			if (this.$route.name=="modifier") {
				axios
					.patch(
						`${this.url}/cours/${this.$route.params.id}/`,
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
						this.displayErrorOrRefreshToken(err, this.Post);
					});
			} else {
				axios
					.post(`${this.url}/cours/`, data, this.headers)
					.then((res) => {
						this.$emit("update", res.data);
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Cours ajouté avec succès !',
							footer: 'Success'
						})
						this.$router.go(-1)
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
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
		getProfFullName(user){
			return user.first_name
		},
		getClasses() {
			axios
				.get(`${this.url}/classes/`, this.headers)
				.then((res) => {
					this.classes = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getClasses);
				}).finally(()=>{
					this.getProfessors()
				})
		},
		getProfessors() {
			axios
				.get(`${this.url}/professeurs/`, this.headers)
				.then((res) => {
					this.professeurs = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.getClasses);
				});
		},
	},
	mounted() {
		this.getClasses();
	},
};
</script>

<style scoped></style>
