<template>
	<transition
		enter-active-class="animate__animated animate__zoomIn animate-fast"
		leave-active-class="animate__animated animate__fadeOut"
	>
		<div
			class="body"
			:class="$store.state.notification.type"
			v-if="visible"
		>
			<div class="content">
				<span>{{ $store.state.notification.message }}</span>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
		};
	},
	watch: {
		"$store.state.notification": {
			deep: true,
			handler(new_val) {
				if (new_val.message) {
					this.visible = true;
					setTimeout(() => {
						this.$store.state.notification = {
							type: "",
							message: "",
						};
					}, 5000);
				} else {
					this.visible = false;
				}
			},
		},
	},
};
</script>

<style scoped>
.body {
	color: var(--color-white);
	border-radius: 0.5em;
	border: 1px solid;
	margin: 10px 0px;
	padding: 12px;
	font-size: 14px;
	text-align: center;
}

.success {
	background-color: var(--color-success);
}
.danger {
	background-color: var(--color-danger);
}
</style>
