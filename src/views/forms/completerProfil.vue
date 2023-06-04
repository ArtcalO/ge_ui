<template>
	<v-container>
		<v-row>
			<v-col >
				<h3 >Completer profil</h3>
				<v-form @submit.prevent="completerProfil" class="form">
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
						:rules="birthRules"
						density="compact"
					></v-text-field>
					<v-autocomplete
						label="Classes"
						:items="classes"
						item-title="classe_full_name"
						item-value="id"
						v-model="classe"
						required
						density="compact"
					></v-autocomplete>
					<v-text-field
						label="Ecole"
						v-model="ecole"
						required
						density="compact"
					></v-text-field>
					<v-btn type="submit" color="secondary"
						>Modifier</v-btn
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
		data(){
			return{
				complet:false,
				classes:[],
				first_name:"",
				last_name:"",
				genre:"",
				date_naissance:"",
				classe:"",
				ecole:"",
				birthRules: [ 
					v => !!v || "Ce champ est requis",
					v => ( v && v >= 1900 ) || "Année doit être superieur à 1900",
					v => ( v && v <= this.currentYear()-5 ) || `L' âge ne doit pas depasser ${this.currentYear()-5}`,
				],
			}
		},
		beforeMount(){
			if(this.$store.state.user){
				this.closeModal()
				this.getClasses()
			}
		},
		mounted(){
				this.first_name=this.$store.state.user.current_student.first_name
				this.last_name=this.$store.state.user.current_student.last_name
				this.genre=this.$store.state.user.current_student.genre
				this.date_naissance=this.$store.state.user.current_student.date_naissance
				this.classe=this.$store.state.user.current_student.classe.id
				this.ecole=this.$store.state.user.current_student.ecole
		},
		methods: {
			goToCompleter() {
				
			},
			completerProfil(){
				let data={
						first_name:this.first_name,
						last_name:this.last_name,
						genre:this.genre,
						date_naissance:this.date_naissance,
						classe:this.classe,
						ecole:this.ecole,
					}
				axios
				.post(`${this.url}/eleves/${this.$store.state.user.current_student.id}/completer-profil/`, data,  this.headers)
				.then((res) => {
					res
					this.$store.state.user.complete=true
					this.$store.state.user.current_student.first_name=data.first_name
					this.$store.state.user.current_student.last_name=data.last_name
					this.$store.state.user.current_student.genre=data.genre
					this.$store.state.user.current_student.date_naissance=data.date_naissance
					this.$store.state.user.current_student.classe=this.getClasseObj(data.classe)
					this.$store.state.user.current_student.ecole=data.ecole
					Swal.fire({
						icon: 'success',
						title: 'Success...',
						text: 'Profil modifié avec success !',
						footer: 'Success'
					})
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err,this.completerProfil);
				})
			},
			getClasseObj(id){
				return this.classes.find(x => x.id === id)
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
		},
};
</script>

<style scoped>
.dialog{
	padding:20px 0px 0px 0px;
}
.btn-group {
		display: flex;
		padding-top: 16px;
		border-top: 1px solid var(--color-soft-grey);
		gap: 8px;
}
</style>

