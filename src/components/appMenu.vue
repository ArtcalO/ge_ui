<template>
	<div class="dashboard">
		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="rail = !rail"></v-app-bar-nav-icon>
			<v-app-bar-title>ECONOMAT</v-app-bar-title>
			<v-spacer></v-spacer>
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
			<v-list density="compact" nav active-color="primary">

				<v-list-item
					prepend-icon="mdi-account"
					:title="getName()"
					nav
					color="primary"
				>
				</v-list-item>
				<v-list-item
					v-if="is_directeur"
					exact
					prepend-icon="mdi-home-city"
					title="Accueil"
					value="home"
					to="/"
				></v-list-item>
				<v-list-item
					exact
					v-if="is_directeur"
					prepend-icon="mdi-account-group-outline"
					to="/personnels"
					title="Personnels"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_directeur"
					to="/niveaux"
					title="Niveaux"
					prepend-icon="mdi-stairs-box"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_directeur"
					to="/sections"
					title="Sections"
					prepend-icon="mdi-road-variant"
				>
				</v-list-item>
				<v-list-item
					exact
					v-if="is_directeur"
					to="/classes"
					title="Classes"
					prepend-icon="mdi-door-open"
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
			if(this.is_directeur) return this.store.user.username
			else return this.store.user.first_name+' '+this.store.user.last_name
		},
		
	},
};
</script>
