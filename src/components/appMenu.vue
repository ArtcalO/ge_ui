<template>
	<div class="dashboard">
		<v-app-bar app clipped-left color="primary">
			<v-app-bar-nav-icon @click.stop="rail = !rail"></v-app-bar-nav-icon>
			<v-app-bar-title>IGATECH</v-app-bar-title>
			<v-spacer></v-spacer>

			<!-- <v-avatar color="secondary">
				<span class="white--text headline">J</span>
			</v-avatar> -->
			<v-btn
				variant="text"
				icon="mdi-power"
				title="Déconnexion"
				@click="logout"
			></v-btn>
		</v-app-bar>
		<v-navigation-drawer
			app
			v-model="drawer"
			:rail="rail"
			permanent
			@click="rail = false"
			clipped
		>
			<v-list v-if="!profilProp" density="compact" nav active-color="primary">
				<v-list-item
					v-if="is_student"
					prepend-icon="mdi-account"
					:title="getName()"
					nav
					to="/completer-profil"
					color="primary"
				></v-list-item>
				<v-list-item
					v-if="!is_student"
					prepend-icon="mdi-account"
					:title="getName()"
					nav
					color="primary"
				>
				</v-list-item>
				<v-list-item
					v-if="is_admin"
					exact
					prepend-icon="mdi-home-city"
					title="Home"
					value="home"
					to="/"
				></v-list-item>
				<v-list-item
					exact
					v-if="is_admin"
					prepend-icon="mdi-account-group-outline"
					to="/professeurs"
					title="Professeurs"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_admin"
					to="/niveaux"
					title="Niveaux"
					prepend-icon="mdi-stairs-box"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_admin"
					to="/sections"
					title="Sections"
					prepend-icon="mdi-road-variant"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_parent"
					to="/enfants"
					title="Enfants"
					prepend-icon="mdi-road-variant"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="!is_prof"
					to="/classes"
					title="Classes"
					prepend-icon="mdi-door-open"
				>
				</v-list-item>
				<v-list-item
					v-if="is_prof || is_admin"
					exact
					to="/cours"
					title="Cours"
					prepend-icon="mdi-book"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_admin || is_prof || canViewSP()"
					to="/cours-speciaux"
					title="Cours Speciaux"
					prepend-icon="mdi-stairs-box"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_student"
					to="/epreuves-types"
					title="Epreuves Types"
					prepend-icon="mdi-stairs-box"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_student"
					to="/formules"
					title="Formules"
					prepend-icon="mdi-stairs-box"
				>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-main>
			<main class="p-3">
				<router-view></router-view>
			</main>
		</v-main>
	</div>
</template>

<script>
export default {
	data() {
		return {
			drawer: true,
			rail: false,
		};
	},
	props:["profilProp"],
	methods: {
		getUserAge(){
			if(this.is_student){
          		let year = new Date().getFullYear() - this.$store.state.user.current_student.date_naissance
          		if(year>12)
          			return true
          		else
          			return false
          	}
          	else
          		return false
        },
		getName() {
			if(this.is_student)
				return this.$store.state.user.current_student.first_name+" "+this.$store.state.user.current_student.last_name
		},
		getInital() {
			if(this.is_student)
				return this.$store.state.user.current_student.first_name[0]+""+this.$store.state.user.current_student.last_name[0]
		},
	},
};
</script>
