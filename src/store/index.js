import { createStore } from 'vuex'

export default createStore({
    state: {
        user: null,
        /*url: 'http://127.0.0.1:8000/api',*/
        url: '/api',
        /*url:'https://app.igatechburundi.com/api',*/
        notification: { type: "", message: "" },
        spinner:false,
        current_teacher: {},
        current_niveau: {},
        current_cycle: {},
        current_section: {},
        current_classe: {},
        current_cour: {},
        current_chapitre: {},
        current_exercice: {}
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {}
})