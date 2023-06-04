<template>
  <v-sheet style="height: 100vh" class="bg-deep-purple pa-12" rounded>
    <v-card
      class="mx-auto px-6 py-8" 
      max-width="344"
      title="Authentification"
      >
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Nom d'utilisateur"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Mot de passe"
          placeholder="Entrer votre mot de passe"
        ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Se connecter
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script>
import axios from "axios";
export default {
  title: "Connexion",
  data() {
    return {
      loading: false,
      form: false,

      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit () {
      if (!this.form) return

        this.loading = true
        let data = new FormData();
        data.append("username", this.username);
        data.append("password", this.password);
        axios
          .post(this.url + "/login/", data)
          .then((response) => {
            console.log(response)
            this.$store.state.user = response.data;
            this.$store.state.notification = {
              type: "success",
              message: response.data.status,
            };
          })
          .catch((error) => {
            if(error && error.response.data.detail)
                this.triggerNotifiaction("danger", error.response.data.detail)
            else
              this.triggerNotifiaction("danger", "Verifiez vos identifiants !")
          });        
      },
      required (v) {
        return !!v || 'Field is required'
      },
  },
};
</script>

<style scoped>

</style>
