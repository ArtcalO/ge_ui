<template>
  <v-container >
    <v-row no-gutters>
      <v-col >
        <v-sheet class="pa-2 ma-2">
              <v-card
                class="mx-auto"
                max-width="344"
                variant="outlined"
                color="primary"
              >
                <v-card-text>
                  
                  <center class="text-h5 text--primary">
                    {{user.professeurs}}
                  </center>
                  <center class="text-h6 text--primary">
                    Professeurs 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>
      </v-col>
      <v-col >
        <v-sheet class="pa-2 ma-2">
              <v-card
                class="mx-auto"
                max-width="344"
                variant="outlined"
                color="primary"
              >
                <v-card-text>
                  
                  <center class="text-h5 text--primary">
                    {{user.eleves}}
                  </center>
                  <center class="text-h6 text--primary">
                    Eleves 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>
      </v-col>
      <v-col >
        <v-sheet class="pa-2 ma-2">
              <v-card
                class="mx-auto"
                max-width="344"
                variant="outlined"
                color="primary"
              >
                <v-card-text>
                  
                  <center class="text-h5 text--primary">
                    {{user.parents}}
                  </center>
                  <center class="text-h6 text--primary">
                    Parents 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
              <v-card
                class="mx-auto"
                max-width="344"
                variant="outlined"
                color="primary"
              >
                <v-card-text>
                  
                  <center class="text-h5 text--primary">
                    {{user.exercices}}
                  </center>
                  <center class="text-h6 text--primary">
                    Exercices 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>  
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
              <v-card
                class="mx-auto"
                max-width="344"
                variant="outlined"
                color="primary"
              >
                <v-card-text>
                  
                  <center class="text-h5 text--primary">
                    {{user.reponses}}
                  </center>
                  <center class="text-h6 text--primary">
                    Reponses 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>  
      </v-col>
    </v-row>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="4"
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
            </v-col>
            <v-col>
            <v-btn prepend-icon="mdi-magnify" class="text-none" color="primary" variant="outlined">
          Rechercher
        </v-btn>
        </v-col>
          </v-row>
        </v-container>
      </v-form>
  </v-container>
</template>
<script>
  export default{
    title:"Acceuil",
    created(){
      if(this.is_student)
        this.$router.push("/classes")

      if(this.is_parent)
        this.$router.push("/enfants")

    }
  }
</script>
<style scoped>
v-col{
  min-height:150px;
}

</style>
