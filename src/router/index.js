import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Teacher from '../views/TeacherView.vue'
import Niveau from '../views/NiveauView.vue'
import Section from '../views/SectionView.vue'
import Classe from '../views/ClasseView.vue'
import Cours from '../views/CoursView.vue'



// Forms
import addCourseView from '@/views/forms/addCourseView.vue'
import addProfessorView from '@/views/forms/addProfessorView.vue'
import addSectionView from '@/views/forms/addSectionView.vue'
import addClasseView from '@/views/forms/addClasseView.vue'
import addNiveauView from '@/views/forms/addNiveauView.vue'
//modifier routes

import modifierChapitreView from '@/views/forms/modifierChapitreView.vue'


const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/professeurs', name: 'Teacher', component: Teacher },
    { path: '/sections', name: 'Section', component: Section },
    { path: '/niveaux', name: 'Niveau', component: Niveau },
    { path: '/classes', name: 'Classe', component: Classe },
    { path: '/cours',component: Cours},


    // Forms routes
    { path: '/professeurs/ajouter', component: addProfessorView },
    { path: '/sections/ajouter', component: addSectionView },
    { path: '/classes/ajouter', component: addClasseView },
    { path: '/niveaux/ajouter', component: addNiveauView },
    { path: '/cycles/ajouter', component: addCycleView },
    //modify

    { path: '/professeurs/modifier/:id', component: addProfessorView },
    { path: '/chapitre/modifier/:id',  component: modifierChapitreView },
    { path: '/niveaux/modifier/:id',  component: addNiveauView },
    { path: '/sections/modifier/:id', component: addSectionView },
    { path: '/classes/modifier/:id', component: addClasseView },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router