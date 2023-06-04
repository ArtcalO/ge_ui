<template>
	<div class="login-section page-side section-ope">
		<div class="section-page_intro">
			<img src="/static/signin-icon-black.png" alt="signin-icon" />
			<p class="section-page-intro_title">Connexion</p>
		</div>
		<div class="login-form-area">
			<p class="form-title">Connexion</p>
			<div class="section-form">
				<form class="login-form" style="display: block">
					<label class="login-page_label">
						<input
							class="login-page_input"
							type="email"
							name="email"
							v-model="username"
							autocomplete="off"
						/>
						<span class="login-page_placeholder">Nom d'utilisateur</span>
					</label>
					<label class="login-page_label">
						<input
							class="login-page_input"
							type="password"
							name="password"
							autocomplete="off"
							v-model="password"
						/>
						<span class="login-page_placeholder">Mot de passe</span>
					</label>
					<v-checkbox v-model="parent"
						color="secondary"
					>
						<template v-slot:label>
							<div >
								Depuis compte parent ?
							</div>
						</template>
					</v-checkbox>
					<label v-if="parent" class="login-page_label">
						<input
							required
							class="login-page_input"
							type="text"
							name="enter pin"
							v-model="pin"
						/>
						<span class="login-page_placeholder" >Entrer le code PIN</span>
					</label>
					<div class="login-section_submit">
						<div class="login-page-submit-btn">
							<v-btn
								class="btn btn-primary-alt"
								color="secondary"
								@click="login"
								:disabled="$store.state.spinner"
							>
							<ion-spinner class="spinener" v-if="$store.state.spinner" name="circular"></ion-spinner>
							Connexion
							</v-btn>
						</div>
					</div>
					<div class="login-page_forget">
						<a href="">Mot de passe oublié ?</a>
					</div>
				</form>
				<form class="forget-form" style="display: none">
					<p class="forget-title">Mot de passe oublié</p>
					<label class="login-page_label">
						<input
							class="login-page_input"
							type="email"
							name="email"
							autocomplete="off"
						/>
						<span class="login-page_placeholder">Email</span>
					</label>
					<div
						class="login-section_submit"
						style="justify-content: space-between"
					>
						<div class="login-page-submit-btn">
							<v-btn
								class="btn btn-primary-alt"
								color="secondary"
								@click="login"
							>Envoyer Email
							</v-btn>
						</div>
						<span class="go-login">Connexion</span>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import { QuillEditor } from '@vueup/vue-quill'
import Swal from 'sweetalert2'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
export default {
	data(){
		return{
			username: "",
			parent:false,
			pin:"",
			password: ""
		}
	},
	mounted(){
		if(this.$store.state.user!=null){
			this.$router.push('/')
		}
	},
	methods: {
		login() {
			if (this.username == "" || this.password == "") {
				Swal.fire({
					icon: 'error',
					text: 'Veuillez remplir toutes les champs !',
				})
			}
			if (this.parent && this.pin == "") {
				Swal.fire({
					icon: 'error',
					text: 'Veuillez ajouter le PIN !',
				})
			}
			else{
				this.$store.state.spinner=true
				let data = new FormData();
				data.append("username", this.username);
				data.append("password", this.password);
				data.append("password", this.password);
				if(this.parent)
					data.append("pin", this.pin);
				axios
				.post(this.url+"/login/", data)
				.then((res) => {
					this.$store.state.user=res.data
					this.$router.push('/')
					this.$store.state.spinner=false
				})
				.catch((error) => {
					this.$store.state.spinner=false
					Swal.fire({
							icon: 'error',
							text: 'Compte non valide !',
						})
					if(error.response.status==500)
						Swal.fire({
							icon: 'error',
							text: 'Compte non valide !',
						})
					if(error.response.status==401 || error.response.status==401 )
						Swal.fire({
							icon: 'error',
							text: 'Compte non valide !',
						})
				});
			}
		},
	},
};
</script>

<style scoped>
.go-login{
	color:var(--ion-color-blue);
}
.spinner{
	margin-right: 20px;
}
</style>
