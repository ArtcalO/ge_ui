<template>
	<div class="signup-section page-side section-clos">
		<div class="section-page_intro">
			<img src="/static/signup-icon.png" alt="signup-icon" />
			<p class="section-page-intro_title">S'inscrire</p>
		</div>
		<div class="signup-form-area">
			<p class="form-title">S'inscrire</p>
			<div class="section-form">
				<form class="signup-form">
					<label class="login-page_label">
						<input
							class="login-page_input"
							type="text"
							required
							name="telephone"
							autocomplete="off"
							v-model="telephone"
						/>
						<span class="login-page_placeholder">Téléphone</span>
					</label>
					<label class="login-page_label">
						<input
							required
							class="login-page_input"
							type="password"
							name="password"
							v-model="password"
						/>
						<span class="login-page_placeholder">Mot de passe</span>
					</label>
					<label class="login-page_label">
						<input
							required
							class="login-page_input"
							type="password"
							name="confirm password"
							v-model="confirm"
						/>
						<span class="login-page_placeholder"
							>Confirmer</span
						>
					</label>
					<v-checkbox v-model="parent"
            color="white"
					>
					<template v-slot:label>
							<div style="color:white">
								Etes-vous parent ?
							</div>
						</template>
					</v-checkbox>
					<div @click="performRegister" class="signup-section_submit">
						<div class="login-page-submit-btn">
							<v-btn
								class="btn btn-primary-alt"
								color="secondary"
							:disabled="$store.state.spinner"
							>
							<ion-spinner class="spinener" v-if="$store.state.spinner" name="circular"></ion-spinner>
							S'enregistrer
							</v-btn>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import Swal from 'sweetalert2'
export default {
	data() {
		return {
			telephone:"",
			password:"",
			confirm:"",
			parent:false,
		};
	},
	methods: {
		performRegister() {
			if (this.telephone == "" || this.password == "" || this.confirm == "") {
				Swal.fire({
					icon: 'error',
					text: 'Veuillez remplir toutes les champs !',
				})
			}
			else{
				this.$store.state.spinner=true
				let data = new FormData();
				data.append("telephone", this.telephone);
				data.append("password", this.password);
				if(this.parent)
					data.append("parent", this.parent);
				axios
				.post(this.url+"/users/register/", data)
				.then(() => {
					this.$store.state.spinner=false
					Swal.fire({
						icon: 'success',
						text: 'Connectez vous pour commencer',
					})
				})
				.catch((error) => {
					this.$store.state.spinner=false
					if(error.response && error.response.data)
						Swal.fire({
							icon: 'error',
							text: error.response.data.details,
						})
					console.log(error)
				});
			}
		},
	},
};
</script>

<style scoped>
.default-alert{
 --background: #161e2c!important;   
 --color:#FF0000!important;
 --border-radius:5px!important;
}
</style>
