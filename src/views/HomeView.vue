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
                    {{user.eleves}}
                  </center>
                  <center class="text-h6 text--primary">
                    Eleves 
                  </center>
                </v-card-text>
              </v-card>
        </v-sheet>
      </v-col>
    </v-row>
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
