<template>
	<dialog
		id="modal"
		:class="{
			'big-dialog': checkNumberClass,
			'massive-dialog': checkMoreClass,
		}"
	>
		<div class="form-container">
			<slot></slot>
		</div>
	</dialog>
</template>

<script>
export default {
	props: ["checkNumberClass", "checkMoreClass"],
	methods: {},
};
</script>

<style scoped>
dialog {
	width: 40%;
	border: none;
	margin: auto;
	padding: 20px;
	border-radius: 8px;
}

dialog.big-dialog {
	width: 65%;
}
dialog.massive-dialog {
	width: 75%;
}

@media screen and (max-width: 40em) {
	dialog {
		width: 80%;
	}
}
dialog::-webkit-scrollbar {
	border-radius: 0 8px 8px 0;
	background-color: #f1f1f1;
}
dialog::-webkit-scrollbar-track {
	padding: 0px 2px;
}
dialog::-webkit-scrollbar-button {
	width: 100%;
	color: #c1c1c1;
}
dialog::-webkit-scrollbar-thumb {
	background-color: #c1c1c1;
	margin: 2px;
}
dialog::backdrop {
	backdrop-filter: blur(5px);
	background: rgba(0, 0, 0, 0.5);
}
ion-icon {
	font-size: 24px;
	border: 1px solid var(--color-soft-grey);
	border-radius: 50%;
	color: var(--color-text);
	cursor: pointer;
	margin-left: auto;
	display: block;
}
</style>
