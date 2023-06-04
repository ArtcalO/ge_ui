<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<h2 class="mb-5">Ajouter un cycle</h2>
				<form @submit.prevent="Post" class="form">
					<v-text-field label="Nom" v-model="nom"></v-text-field>
					<v-autocomplete
						label="Niveau"
						:items="niveaus"
						item-title="nom"
						item-value="id"
						v-model="niveau"
					></v-autocomplete>
					<v-btn class="btn-blue" type="submit">Enregistrer</v-btn>
				</form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from "axios";
export default {
	props: ["edit"],
	data() {
		return {
			nom: "",
			niveau: "",
			niveaus: [],
		};
	},
	watch: {
		edit: {
			deep: true,
			immediate: true,
			handler(new_val) {
				if (new_val) {
					this.nom = this.$store.state.current_cycle.nom;
					this.niveau = this.$store.state.current_cycle.niveau.id;
				}
			},
		},
	},
	methods: {
		Post() {
			let data = {
				nom: this.nom,
				niveau: this.niveau,
			};
			if (this.edit) {
				axios
					.patch(
						`${this.url}/cycles/${this.$store.state.current_cycle.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$emit("update", res.data);
						this.closeModal();
						this.successAllert({
							body: " Cycle modifiée avec succès",
						});
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.Post);
					});
			} else {
				axios
					.post(`${this.url}/cycles/`, data, this.headers)
					.then((res) => {
						this.$emit("update", res.data);
						this.closeModal();
						this.successAllert({
							body: "Cycle ajoutée avec succès",
						});
					})
					.catch((err) => {
							this.displayErrorOrRefreshToken(err, this.Post);
					});
			}
		},
		clearInputs() {
			this.nom = "";
			this.niveau = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
		getNiveaus() {
			axios
				.get(`${this.url}/niveaux/`, this.headers)
				.then((res) => {
					this.niveaus = res.data.results;
				})
				.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.getNiveaus);
				});
		},
	},
	mounted() {
		this.getNiveaus();
	},
};
</script>

<style scoped></style>
