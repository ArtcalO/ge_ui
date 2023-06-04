<template>
		<dialog-overlay id="profil-complete">
				<h4>Profil incomplet, veuillez en completer</h4>
				<button class="btn btn-primary" @click="goToCompleter">
						Completer
				</button>
		</dialog-overlay>
</template>

<script>
import dialogOverlay from "./dialogOverlay.vue";

export default {
		components: { dialogOverlay },
		methods: {
			goToCompleter() {
				this.$router.replace("/completer-profil")
				this.closeModal()
				console.log(this.$route)
			},
		}
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

