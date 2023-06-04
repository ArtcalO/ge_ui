<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">Ajouter un enfant</h2>
				<v-form @submit.prevent="Post" class="form">
					<v-text-field
						label="Nom"
						v-model="first_name"
						required
						density="compact"
					></v-text-field>
					<v-text-field
						label="Prenom"
						v-model="last_name"
						required
						density="compact"
					></v-text-field>
					<v-autocomplete
						label="Genre"
						:items="['M', 'F']"
						v-model="genre"
						density="compact"
					></v-autocomplete>
					<v-text-field
						label="Année de naissance"
						v-model="date_naissance"
						required
						density="compact"
					></v-text-field>
					<v-autocomplete
						label="Classes"
						:items="classes"
						item-title="nom"
						item-value="id"
						v-model="classe"
						required
						density="compact"
					></v-autocomplete>
					<v-text-field
						label="PIN pour l'utlisateur"
						v-model="pin"
						required
						density="compact"
					></v-text-field>
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
			first_name:"",
			last_name:"",
			genre:"",
			date_naissance:"",
			classe:"",
			pin:"",
		};
	},
	methods: {
		Post() {
			let data = {
				first_name:this.first_name,
				last_name:this.last_name,
				genre:this.genre,
				date_naissance:this.date_naissance,
				classe:this.classe,
				pin:this.pin
			};
			if (this.edit) {
				axios
					.patch(
						`${this.url}/eleves/${this.$store.state.current_cour.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$emit("close");
						this.closeModal();
						this.successAllert({
							body: "Enfant modifiée avec succès",
						});
					})
					.catch((err) => {
							this.displayErrorOrRefreshToken(err, this.Post);
					});
			} else {
				axios
					.post(`${this.url}/parents/${this.user.parent_id}/add-child/`, data, this.headers)
					.then((res) => {
						this.$emit("update", res.data);
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Enfant ajouté avec succès !',
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
					if (
						err.response.status == 401 ||
						err.response.status == 403
					) {
						this.displayErrorOrRefreshToken(err, this.getClasses);
					} else {
						console.log(err);
					}
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
					if (
						err.response.status == 401 ||
						err.response.status == 403
					) {
						this.displayErrorOrRefreshToken(err, this.getClasses);
					} else {
						console.log(err);
					}
				});
		},
	},
	mounted() {
		this.getClasses();
	},
};
</script>

<style scoped></style>
