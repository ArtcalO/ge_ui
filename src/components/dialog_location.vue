<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      width="400px"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>Details Location</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              @click="dialog = false"
            >
              Fermer
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          lines="two"
          subheader
        >
          <v-list-item title="TYPE_ENTREE" :subtitle="getEntreeType(detailsProps.type_entree)"></v-list-item>
          <v-list-item title="MONTANT" :subtitle="detailsProps.montant"></v-list-item>
          <v-list-item title="DETAILS" :subtitle="detailsProps.details"></v-list-item>
          <v-list-item title="NOM" :subtitle="detailsProps.detailsEntree.nom"></v-list-item>
          <v-list-item title="PRENOM" :subtitle="detailsProps.detailsEntree.prenom"></v-list-item>
          <v-list-item title="TELEPHONE" :subtitle="detailsProps.detailsEntree.telephone"></v-list-item>
          <v-list-item title="ADRESSE" :subtitle="detailsProps.detailsEntree.adresse"></v-list-item>
          <v-list-item title="CNI" :subtitle="detailsProps.detailsEntree.cni"></v-list-item>
          <v-list-item title="DATE_DEBUT" :subtitle="detailsProps.detailsEntree.date_debut"></v-list-item>
          <v-list-item title="DATE_FIN" :subtitle="detailsProps.detailsEntree.date_fin"></v-list-item>
          
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    props:["detailsProps"],
    data () {
      return {
        dialog: false,
      }
    },
    mounted(){
      console.log(this.detailsProps)
      this.dialog=true
    }
  }
</script>