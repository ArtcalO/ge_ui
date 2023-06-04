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
        user_is(name) {
            return this.$store.state.user.groups.includes(name)
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
        
        displayErrorOrRefreshToken(callback) {
            let refresh = this.$store.state.user.refresh
            if (!refresh) {
                this.$store.state.user = null;
            }
            axios.post(this.url + "/refresh/", { "refresh": refresh })
                .then((response) => {
                    this.$store.state.user.access = response.data.access
                    callback()
                })
                .catch(() => {
                    this.$store.state.user = null;
                    this.$store.state.notification = {
                        type: "danger",
                        message: "Session terminée"
                    }
                })
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
        convertToHours(n) {
            var num = n;
            var hours = num / 60;
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);

            return (`${rhours ? rhours : 0}h${rminutes ? rminutes : 0
                }min`);
        },
        convertToKilometers(x) {
            x = x / 1000
            x = x.toString();
            x = x.slice(0, x.indexOf(".") + 3);
            return x ? x : 0;
        },
        CalculTotal(x, y) {
            return x
                .map((a) => a[y])
                .reduce((tot, d) => tot + d, 0)
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
        pagination(count, pages) {
            let int_ = parseInt(count / pages);
            let reste_ = count % pages;

            let list = reste_ ? int_ + 1 : int_;
            return list ? list : 0;
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
        is_admin(){
           return this.$store.state.user.is_admin
        },
        is_comptable(){
           return this.$store.state.user.groups.includes('Eleve')
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