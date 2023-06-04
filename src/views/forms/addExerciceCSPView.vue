<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<v-form @submit.prevent="Post" class="form">
					<v-text-field
						label="Question"
						v-model="question"
					></v-text-field>
					<v-text-field
						label="Detail"
						v-model="detail"
					></v-text-field>
					<v-text-field
						label="Réponse"
						v-model="reponse"
					></v-text-field>
					<v-text-field
						label="Mauvaise réponse 1"
						v-model="mauvaise_reponse1"
					></v-text-field>
					<v-text-field
						label="Mauvaise réponse 2"
						v-model="mauvaise_reponse2"
					></v-text-field>
					<v-text-field
						label="Mauvaise réponse 3"
						v-model="mauvaise_reponse3"
					></v-text-field>

					<v-btn type="submit" class="btn btn-blue"
						>Enregistrer</v-btn
					>
				</v-form>
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
			chapitre: "",
			question: "",
			detail: "",
			reponse: "",
			mauvaise_reponse1: "",
			mauvaise_reponse2: "",
			mauvaise_reponse3: "",
		};
	},
	watch: {
		edit: {
			deep: true,
			immediate: true,
			handler(new_val) {
				if (new_val) {
					this.question = this.$store.state.current_exercice.question;
					this.detail = this.$store.state.current_exercice.detail;
					this.reponse = this.$store.state.current_exercice.reponse;
					this.mauvaise_reponse1 =
						this.$store.state.current_exercice.mauvaise_reponse1;
					this.mauvaise_reponse2 =
						this.$store.state.current_exercice.mauvaise_reponse2;
					this.mauvaise_reponse3 =
						this.$store.state.current_exercice.mauvaise_reponse3;
					this.chapitre =
						this.$store.state.current_exercice.chapitre.id;
				}
			},
		},
	},
	methods: {
		Post() {
			let data = {
				question: this.question,
				detail: this.detail,
				reponse: this.reponse,
				mauvaise_reponse1: this.mauvaise_reponse1,
				mauvaise_reponse2: this.mauvaise_reponse2,
				mauvaise_reponse3: this.mauvaise_reponse3,
				chapitre: this.$route.params.id,
			};
			if (this.edit) {
				axios
					.patch(
						`${this.url}/exercices-csp/${this.$store.state.current_exercice.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$emit("update", res.data);
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Exercice modifié avec success !',
							footer: 'Success'
						}).then(()=>{
							this.$router.go(-1)
						})
						
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.Post);
					})
			} else {
				axios
					.post(`${this.url}/exercices-csp/`, data, this.headers)
					.then((res) => {
						this.$emit("update", res.data);
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Exercice ajouté avec success !',
							footer: 'Success'
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
			this.chapitre = "";
			this.question = "";
			this.detail = "";
			this.reponse = "";
			this.mauvaise_reponse1 = "";
			this.mauvaise_reponse2 = "";
			this.mauvaise_reponse3 = "";
			this.chapitres = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
	},
};
</script>

<style scoped></style>
