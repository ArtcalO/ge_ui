<template>
	<v-app>
		<div v-if="this.$store.state.user">
			<app-menu :profilProp="profilObj" />
		</div>
		<div v-else>
			<LoginView/>
		</div>
	</v-app>
</template>

<script>
import LoginView from "./views/LoginView.vue";
import AppMenu from "./components/appMenu.vue";
import dialogComplete from "@/components/dialogComplete.vue";
export default {
	components: {
		AppMenu,
		LoginView,
		dialogComplete,
	},
	data(){
		profilObj:false
	},
	watch: {
		"$store.state.user": {
			deep: true,
			imediate: true,
			handler(new_val) {
				if (new_val) {
					localStorage.setItem("user", JSON.stringify(new_val));
					if(this.$store.state.user && this.is_student && !this.$store.state.user.complete && this.$route.path !=="/completer-profil"){
				let modal = document.getElementById("profil-complete");
				modal.showModal();
			}
				} else {
					localStorage.removeItem("user");
				}
			},
		},
	},
	mounted() {
		var user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			this.$store.state.user = user;
		}
		if(this.$route.name=="/completer-profil")
			this.profilObj=true

	},
};
</script>

<style src="./styles.css"></style>
