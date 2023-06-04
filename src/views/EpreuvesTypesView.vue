<template>
	  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-if="!is_student"
        >
		          <v-autocomplete
					label="Classes"
					:items="classes"
					item-title="nom"
					item-value="id"
					v-model="classe"
					density="compact"
					required
				></v-autocomplete>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
		<v-autocomplete
			label="Cours"
			:items="courses"
			item-title="nom"
			item-value="id"
			v-model="cours"
			density="compact"
			required
		></v-autocomplete>
        </v-col>
        <v-col>
        <v-btn prepend-icon="mdi-magnify" class="text-none" color="primary" variant="outlined">
			Rechercher
		</v-btn>
		</v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import Swal from 'sweetalert2'
import axios from "axios";
export default {
	props: ["edit"],
	data() {
		return {
			classes: [],
			courses: [],
			classe: "",
			cours: "",
			nom: "",
			description: "",
		};
	},
	methods: {
		clearInputs() {
			this.classe = "";
			this.nom = "";
			this.description = "";
		},
		getClasses() {
			axios
				.get(`${this.url}/classes/`, this.headers)
				.then((res) => {
					this.classes = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(this.getClasses);
				}).finally(()=>{
					if(!this.is_student)
						this.getCourses(this.classe)
				})
		},
		getCourses(id) {
			axios
				.get(`${this.url}/cours/?classe=${id}`, this.headers)
				.then((res) => {
					this.courses = res.data.results;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(this.getCourses);
				});
		},
	},
	mounted() {
		if(!this.is_student)
			this.getClasses()
		else
			this.getCourses(this.student_class_id)
	},
};
</script>

<style scoped></style>
