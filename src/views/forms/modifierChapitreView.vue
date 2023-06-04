<template>
  <div>
    <h2>Cours : {{fullChapterName}}</h2>
    <br>
    <v-form @submit.prevent="modifierChapitre" class="form">
          <v-text-field
            label="Nom du chapitre"
            v-model="nom"
            required
          ></v-text-field>
          <QuillEditor theme="snow" v-model:content="note" contentType="html" toolbar="full" />
    </v-form>
    <br>
    <v-btn type="submit" color="secondary" @click="modifierChapitre" class="btn btn-blue"
      >Modifier</v-btn
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
      current_chapter:[],
      editorOption:{}
    }
  },
  components:{
    QuillEditor    
  },
  computed: {
    fullChapterName() {
      if(this.current_chapter)
        return `${this.current_chapter.nom}`
    },
  },
  mounted(){
    this.getCurrentChapter()
  },
  methods:{
    getCurrentChapter(){
      axios.get(`${this.url}/chapitres/${this.$route.params.id}`, this.headers)
      .then((res)=>{
        console.log(res.data)
        this.current_chapter=res.data
        this.note= this.current_chapter.note
        this.nom= this.current_chapter.nom
      }).catch((err)=>{
        this.displayErrorOrRefreshToken(this.getCurrentChapter)
      })
    },
    modifierChapitre(){
      let data = new FormData()
      data.append('nom',this.nom)
      data.append('note',this.note)
      data.append('cour',this.current_chapter.cour.id)
      axios
          .put(`${this.url}/chapitres/${this.$route.params.id}/`, data, this.headers)
          .then(() => {
            this.$router.go(-1)
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Chapitre modifié avec success !',
              footer: 'Success'
            })
          })
          .catch((err) => {
              this.displayErrorOrRefreshToken(err,this.Post);
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