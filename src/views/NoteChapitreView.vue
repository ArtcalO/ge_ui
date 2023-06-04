<template>
	<div>
		<div class="header">
			<ion-icon
				:src="getIcon('arrowBackOutline')"
				class="menu"
				@click="goBack"
			>
			</ion-icon>
		</div>
		<div class="padding">
			<div class="wrapper">
				<div class="table">
					<div class="item">
						<v-table
							hover="true"
							density="compact"
						>
							<thead class="value">
								<tr class="field">
									<th>Note :</th>
									<td>{{ chapitre.note }}</td>
								</tr>
							</thead>
							<!-- <tbody>
                                <tr>
                                </tr>
                            </tbody> -->
						</v-table>
					</div>
				</div>
			</div>
		</div>
		<confirm-delete :request="request" v-on:delete="supprimer" />
	</div>
</template>

<script>
import ConfirmDelete from "@/components/confirmDelete.vue";
export default {
	components: {
		ConfirmDelete,
	},
	data() {
		return {
			chapitre: this.$store.state.current_chapitre,
			edit: false,
			request: {},
		};
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		getCreated(created) {
			this.chapitre = created;
		},
	},
};
</script>

<style scoped></style>
