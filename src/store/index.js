import { createStore } from 'vuex'

export default createStore({
    state: {
        user: null,
        url: 'http://127.0.0.1:8000/api',
        /*url: '/api',*/
        /*url:'https://app.igatechburundi.com/api',*/
        notification: { type: "", message: "" },
        spinner:false,
        current_teacher: {},
        current_niveau: {},
        current_cycle: {},
        current_section: {},
        current_classe: {},
        TYPES_ENTREES : {
            "AUTRES" : 0,
            "BUDGET_MINISTRE" : 1,
            "LOCATION_SALLE" : 2,
            "LOCATION_TERRAIN" : 3,
            "LOCATION_CHAMP" : 4,
            "LOCATION_ATELIER" : 5,
            "PAIEMENT_MINERVAL" : 6
        }


    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {}
})