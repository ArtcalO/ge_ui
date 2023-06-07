<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<v-form @submit.prevent="performAction" class="form">
					<v-text-field
						variant="outlined"
						label="Nom"
						v-model="nom"
					></v-text-field>
					<v-text-field
						variant="outlined"
						label="Prénom"
						v-model="prenom"
					></v-text-field>
					<v-text-field
						variant="outlined"
						label="Date de naissance"
						v-model="date_naissance"
						type="date"
						required
					></v-text-field>
					<v-autocomplete
						label="Genre"
						variant="outlined"
						:items="['Masculin', 'Féminin']"
						v-model="genre"
					></v-autocomplete>
					<v-autocomplete
						variant="outlined"
						label="Classes"
						:items="classes"
						item-title="classe_full_name"
						item-value="id"
						v-model="classe"
						required
					></v-autocomplete>
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
			eleve_actif:[],
			nom: "",
			prenom: "",
			genre: "",
			date_naissance: "",
			classe: "",
			classes:[],
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/eleves/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.eleve_actif=res.data
			}).catch((err)=>{
				console.log(erro)
			}).finally(()=>{
				this.username =
					this.eleve_actif.user.username;
				this.first_name =
					this.eleve_actif.user.first_name;
				this.last_name =
					this.eleve_actif.user.last_name;
				this.password =
					this.eleve_actif.user.password;
				this.telephone =
					this.eleve_actif.telephone;
				this.genre = this.eleve_actif.genre;
			})
			
		}
	},
	beforeMount(){
		if(this.$store.state.user){
			this.getClasses()
		}
	},
	methods: {
		performAction() {
			let data = new FormData();
			data.append("nom", this.nom);
			data.append("prenom", this.prenom);
			data.append("genre", this.genre);
			data.append("date_naissance", this.date_naissance);
			data.append("classe", this.classe);

			this.$store.state.loading = true;
			if (this.$route.params.id) {
				axios
					.patch(
						`${this.url}/eleves/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$router.push('/eleves')
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
					.post(`${this.url}/eleves/`, data, this.headers)
					.then((res) => {
						this.$router.push("/eleves");
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Eleve ajouté avec succès !',
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
			.get(`${this.url}/classes/`, this.headers)
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
