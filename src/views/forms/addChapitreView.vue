<template>
  <div>
    <h2>Cours : {{fullCourseName}}</h2>
    <br>
    <v-form @submit.prevent="Enregistrer" class="form">
          <v-text-field
            label="Nom du chapitre"
            v-model="nom"
            required
          ></v-text-field>
          <QuillEditor theme="snow" v-model:content="note" contentType="html" toolbar="full" />
    </v-form>
    <br>
    <v-btn type="submit" @click="Enregistrer" class="btn btn-blue"
      >Enregistrer</v-btn
    >
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import Swal from 'sweetalert2'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  name: 'App',
  data(){
    return{
      note:'',
      nom:'',
      current_course:[],
      editorOption:{}
    }
  },
  components:{
    QuillEditor    
  },
  computed: {
    fullCourseName() {
      if(this.current_course)
        return `${this.current_course.nom}`
    },
  },
  mounted(){
    this.getCurrentCourse()
  },
  methods:{
    getCurrentCourse(){
      axios.get(`${this.url}/cours/${this.$route.params.id}`, this.headers)
      .then((res)=>{
        console.log(res.data)
        this.current_course=res.data
      }).catch((err)=>{
        this.displayErrorOrRefreshToken(err, this.getCurrentCourse)
      })
    },
    Enregistrer(){
      let data = new FormData()
      data.append('nom',this.nom)
      data.append('note',this.note)
      data.append('cour',this.$route.params.id)
      axios
          .post(`${this.url}/chapitres/`, data, this.headers)
          .then(() => {
            this.$router.go(-1)
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Chapitre ajouté avec success !',
              footer: 'Success'
            })
          })
          .catch((err) => {
              this.displayErrorOrRefreshToken(err, this.Post);
          })
      },
    onEditorBlur (quill){
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill){
      console.log('editor focus!', quill)
    },
    onEditorReady (quill){
      console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }){
      console.log('editor change!', quill, html, text)
      this.content =html
    }
  }
  }
</script>