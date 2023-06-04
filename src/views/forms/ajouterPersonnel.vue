<template>
	<v-container>
		<v-row>
			<v-col cols="8">
				<v-form @submit.prevent="performAction" class="form">
					<v-text-field
						label="Nom d'utilisateur"
						v-model="username"
					></v-text-field>
					<v-text-field
						label="Nom"
						v-model="first_name"
					></v-text-field>
					<v-text-field
						label="Prénom"
						v-model="last_name"
					></v-text-field>
					<v-text-field
						label="Mot de passe"
						v-model="password"
					></v-text-field>
					<v-text-field
						label="Téléphone"
						v-model="telephone"
					></v-text-field>
					<v-autocomplete
						:items="['Masculin', 'Féminin']"
						v-model="genre"
					></v-autocomplete>

					<v-btn v-if="$route.params.id" class="btn btn-primary" type="submit"
						>Modifier</v-btn
					>
					<v-btn v-else class="btn btn-primary" type="submit"
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
			current_professor:[],
			username: "",
			last_name: "",
			first_name: "",
			password: "",
			telephone: "",
			genre: "",
		};
	},
	created(){
		if(this.$route.params.id){
			axios.get(`${this.url}/professeurs/${this.$route.params.id}/`, this.headers)
			.then((res)=>{
				this.current_professor=res.data
			}).catch((err)=>{
				console.log(erro)
			}).finally(()=>{
				this.username =
					this.current_professor.user.username;
				this.first_name =
					this.current_professor.user.first_name;
				this.last_name =
					this.current_professor.user.last_name;
				this.password =
					this.current_professor.user.password;
				this.telephone =
					this.current_professor.telephone;
				this.genre = this.current_professor.genre;
			})
			
		}
	},
	methods: {
		performAction() {
			let data = new FormData();
			data.append("user.username", this.username);
			data.append("user.first_name", this.first_name);
			data.append("user.last_name", this.last_name);
			data.append("user.password", this.password);
			data.append("telephone", this.telephone);
			data.append("genre", this.genre);

			this.$store.state.loading = true;
			if (this.$route.params.id) {
				axios
					.patch(
						`${this.url}/professeurs/${this.$route.params.id}/`,
						data,
						this.headers
					)
					.then((res) => {
						this.$router.push('/professeurs')
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Professeur modifié avec success !',
							footer: 'Success'
						})
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err,this.performAction);
					});
			} else {
				axios
					.post(`${this.url}/professeurs/`, data, this.headers)
					.then((res) => {
						this.$router.push("/professeurs");
						Swal.fire({
							icon: 'success',
							title: 'Success...',
							text: 'Professeur ajoutée avec succès !',
							footer: 'Success'
						})
					})
					.catch((err) => {
						console.log(err)
							this.displayErrorOrRefreshToken(err,this.performAction);
					})
					
			}
		},
		clearInputs() {
			this.username = "";
			this.first_name = "";
			this.last_name = "";
			this.password = "";
			this.telephone = "";
			this.genre = "";

			if (this.edit) {
				this.$emit("resetEdit");
			}
		},
	},
};
</script>

<style scoped></style>
