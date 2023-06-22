import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Personnel from '../views/PersonnelView.vue'
import Niveau from '../views/NiveauView.vue'
import Section from '../views/SectionView.vue'
import Classe from '../views/ClasseView.vue'
import Eleve from '../views/EleveView.vue'
import EntreesView from '../views/EntreesView.vue'



// Forms
import ajouterPersonnel from '@/views/forms/ajouterPersonnel.vue'
import addSectionView from '@/views/forms/addSectionView.vue'
import addClasseView from '@/views/forms/addClasseView.vue'
import addNiveauView from '@/views/forms/addNiveauView.vue'
import addEleveView from '@/views/forms/addEleveView.vue'
//modifier routes


const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/personnels', name: 'Personnel', component: Personnel },
    { path: '/sections', name: 'Section', component: Section },
    { path: '/niveaux', name: 'Niveau', component: Niveau },
    { path: '/classes', name: 'Classe', component: Classe },
    { path: '/eleves', name: 'Eleve', component: Eleve },
    { path: '/entrees', name: 'EntreesView', component: EntreesView },


    // Forms routes
    { path: '/personnels/ajouter', component: ajouterPersonnel },
    { path: '/sections/ajouter', component: addSectionView },
    { path: '/classes/ajouter', component: addClasseView },
    { path: '/niveaux/ajouter', component: addNiveauView },
    { path: '/eleves/ajouter', component: addEleveView },
    //modify

    { path: '/personnels/modifier/:id', component: ajouterPersonnel },
    { path: '/niveaux/modifier/:id',  component: addNiveauView },
    { path: '/sections/modifier/:id', component: addSectionView },
    { path: '/classes/modifier/:id', component: addClasseView },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router