import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import * as allIcons from 'ionicons/icons'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/css/bootstrap-utilities.min.css"
import "bootstrap/dist/css/bootstrap-grid.min.css"
import "bootstrap"


import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { IonicVue, IonIcon,IonSpinner } from '@ionic/vue'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const appThemeLight = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: '#013b4f',
        'primary-darken-1': '#013b4f',
        secondary: '#f65403',
        'secondary-darken-1': '#f65403',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    }
}

const vuetify = createVuetify({
    components,
    directives,
    ssr:true,
    theme: {
        themes: {
            light: appThemeLight
        }
    },
    icons:{
        defaultSet:"mdi",
        aliases,
        sets:{
            mdi,
        }
    }
})

window.axios = axios

const app = createApp(App)
            .use(router)
            .use(store)
            .use(vuetify)
            .use(IonicVue)
            .use(VueSweetalert2)

app.component('IonIcon', IonIcon)
app.component('IonSpinner', IonSpinner)



app.mixin({
    methods: {
        logout() {
            this.$store.state.user = null;
            localStorage.removeItem("user");
            this.$store.state.disconnected = true
            this.$router.replace("/")
        },
        loadGroups() {
            axios.get(this.url + 'groups/', this.headers)
                .then((res) => {
                    this.$store.state.groups = res.data.results
                }).catch((error) => {
                    console.log(error)
                })
        },
        getIcon(name) {
            return allIcons[name]
        },
    cleanString(str){
      if ((str===null) || (str==='')){
        return ""
      }
      if(JSON.stringify(str).includes("Django")){
        return "données reçues invalides"
      };
      if(typeof(str)=='object'){
        let string = ""
        for( let [clef, valeur] of Object.entries(str)){
          if(typeof(valeur)=='object'){
            let child = ""
            for( let [key, value] of Object.entries(valeur)){
              child += `${key}: ${value} `
            }
            valeur = child;
          }
          string+=`${clef}: ${valeur}<br>`
        }
        return string;
      };
      str = str.toString();
      return str.replace(/(<style[\w\W]+style>)/g, "").replace( /(<([^>]+)>)/ig, '');
    },  
    displayErrorOrRefreshToken(error, callback){
      if(!!error.response){
        if(error.response.data.code == "token_not_valid"){ 
          let refresh = this.$store.state.user.refresh
          if(!refresh){
            this.$store.state.user = null;
            return
          }
          axios.post(this.url+"/refresh/", {"refresh":refresh})
          .then((response) => {
            this.$store.state.user.access = response.data.access
            if(typeof callback == "function") callback()
          }).catch((error) => {
            this.$store.state.user = null;
            console.error(error)
            this.$store.state.alert = {
              type:"danger", message:this.cleanString(error.response.data)
            }
          })
        } else {
          console.error(error)
          this.$store.state.alert = {
            type:"danger", message:this.cleanString(error.response.data)
          }
        }
      } else {
        console.error(error)
      }
    },
        money(x) {
            x = parseFloat(x).toFixed(0)
            if (!x) return "-";
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },
        formatDate(x) {
            if (!x) return '-'
            let date = new Date(x)
            return new Intl.DateTimeFormat(
                'fr-FR', { dateStyle: 'short' }
            ).format(date)
        },
        fullName(x, y) {
            if (x && y) {
                return `${x} ${y}`
            }
            return ''
        },
        shortString(x) {
            if (x) {
                return x.length <= 25 ? x : x.substring(0, 25) + '...'
            }
            return ''
        },
        getTitle(vm) {
            const { title } = vm.$options
            if (title) {
                return typeof title === 'function' ?
                    title.call(vm) :
                    title
            }
        },
        clearMenu() {
            let menus = document.querySelectorAll(".menu-options");
            menus.forEach((item) => {
                item.classList.remove("show-menu");
                item.classList.remove("animate__animated");
                item.classList.remove("animate__fadeIn");
            });
        },
        triggerNotification(type, message) {
            this.$store.state.notification = {
                type: type,
                message: message
            }
        },
        getRandomElements(arr, n) {
            var result,
                len = arr.length,
                taken = new Array(len);
            if (n > len){
                result = new Array(len);
                n=len
            }
            else
                result = new Array(n);
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len in taken ? taken[len] : len;
            }
            return result;
        },
        currentYear(){
            return new Date().getFullYear()
        },
    },
    //arr.slice(Math.max(arr.length - 5, 1))
    computed: {
        user() {
            return this.$store.state.user
        },
        is_directeur(){
           return this.$store.state.user.is_admin || this.$store.state.user.groups.include("directeur")
        },
        is_comptable(){
           return this.$store.state.user.groups.includes('econome')
        },
        url() {
            return this.$store.state.url
        },
        store() {
            return this.$store.state
        },
        headers() {
            return {
                headers: {
                    "Authorization": "Bearer " + this.$store.state.user.access,
                    "Content-Type": "application/json"
                }
            }
        },
        today() {
            let today = new Date()
            let dates = {
                name: today.toLocaleDateString('fr-FR', { weekday: 'long' }),
                month: today.toLocaleDateString('fr-FR', { month: 'long' }),
                day: today.getDate(),
                monthDigit: today.getMonth() + 1,
                year: today.getFullYear(),
                hours: today.getHours(),
                minutes: today.getMinutes(),
                seconds: today.getSeconds()
            }
            dates.full = `${dates.year}-${dates.monthDigit < 10 ? '0' + dates.monthDigit : dates.monthDigit}-${dates.day}`
            return dates
        },
    },
    created() {
        const title = this.getTitle(this)
        if (title) {
            document.title = title + ' - IgaTech'
        }
    },
})

// Click outside directive
const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = event => {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: el => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

app
    .directive("click-outside", clickOutside)
    .mount('#app')