<template>
	<div>
		<div class="table">
			<div class="table-container">
			<div id="main">
				<div id="steps">
					<div class="content">
						<div class="instructions">
								
							<div class="inner">
								<div class="buttons-groups">
									<h2 class="step-title">Exerices</h2>
								</div>
								<form class="quiz-body" @submit.prevent="validateUserResponse">
									<ol class="quiz-question-list">
										<li
											class="quiz-question"
											v-for="(item,i) in getRandomElements(exercice,10)"
											:data-index="i"
											data-type="multiple_choice_single_answer"
											:key="item.id"
										>
											<span class="quiz-question-header">{{item.question}}</span>

											<section class="quiz-answers">
												<div v-for="(el,i) in shuffleArray([item.reponse,item.mauvaise_reponse1,item.mauvaise_reponse2,item.mauvaise_reponse3])" :key="i" class="quiz-answer" :data-index="i">
													<input
														type="radio"
														class="form-check-input"
														:value="el"
														:id="item.id"
														:name="item.id"
														@change="getCheckBoxValue(item.id,el)"
													/>
													<label for="question-0-0">{{el}}</label>
													<div class="quiz-feedback"></div>
												</div>
											</section>
										</li>
										<v-btn  color="primary" type="submit">Valider</v-btn>
									</ol>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			</div>
			</div>
		<confirm-delete :request="request" v-on:delete="supprimer" />
		<DialogReponses :correctionExerciceProps="correction_exercices"/>
		<v-overlay v-model="overlay">
			<v-progress-circular indeterminate size="64">
				En cours de d'envoie....
			</v-progress-circular>
		</v-overlay>
	</div>
</template>

<script>
import axios from "axios";
import ConfirmDelete from "@/components/confirmDelete.vue";
import DialogReponses from "@/components/dialog_reponses.vue";
import Swal from 'sweetalert2'
export default {
	components: {
		ConfirmDelete,
		DialogReponses
	},
	data() {
		return {
			exercice: [],
			responses: [],
			correction_exercices: [],
			keyword: "",
			inyishu:false,
			response:[],
			edit: false,
			request: {},
			searching: false,
			pages: 0,
			overlay:false,
		};
	},
	methods: {
		fetchExercices() {
			axios
				.get(`${this.url}/exercices-csp/?chapitre=${this.$route.params.id}`, this.headers)
				.then((res) => {
					this.exercice = res.data.results;
					this.searching = false;
				})
				.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.fetchExercices);
				});
		},
		getCheckBoxValue(el,value){
			let obj = {"q_id":el,"resp":value}
			this.upsert(this.responses,obj)
		},
		upsert(array, element) {
			const i = array.findIndex(_element => _element.q_id === element.q_id);
			if (i > -1) array[i] = element;
			else array.push(element);
		},
		modifier(x) {
			this.edit = true;
			this.$store.state.current_exercice = x;
			this.openModal();
		},
		requestSupprimer(x) {
			this.request = x;
			let modal = document.getElementById("confirm");
			modal.showModal();
		},
		shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array
		},
		validateUserResponse(){
			this.overlay=true
			if(this.responses.length==0){
				Swal.fire({
					icon: 'error',
					title: 'Pas de reponses soumises...',
					text: 'Veuillez repondre au moins une question !'
				})
				this.overlay=false
			}else
				axios
					.post(`${this.url}/reponses-csp/`, {"reponses":this.responses}, this.headers)
					.then((res) => {
						this.correction_exercices=res.data
						this.overlay=false
						let modal = document.getElementById("reponses_exercices");
						modal.showModal();
					})
					.catch((err) => {
						this.displayErrorOrRefreshToken(err, this.validateUserResponse);
					});
		},
		supprimer(x) {
			axios
				.delete(`${this.url}/exercices/${x.id}/`, this.headers)
				.then(() => {
					let id = this.exercices.indexOf((i) => i.id === x.id);
					this.exercices.splice(id, 1);
					this.$store.state.notification = {
						type: "success",
						message: "Exercice supprimé avec succès",
					};
					setTimeout(() => {
						this.closeModal();
					}, 4000);
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.supprimer);
				});
		},
		search() {
			axios
				.get(
					`${this.url}/exercices/?search=${this.keyword}`,
					this.headers
				)
				.then((res) => {
					this.exercices = res.data.results;
					this.pages = this.pagination(
						res.data.count,
						this.exercices.length
					);
					this.searching = true;
				})
				.catch((err) => {
					this.displayErrorOrRefreshToken(err, this.search);
				});
		},
	},
	mounted() {
		this.fetchExercices();
	},
};
</script>

<style scoped>
.table {
	margin-top: 10px;
}
.instructions {
	box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%),
	0 2px 6px 2px rgb(60 64 67 / 15%);
	background: #fff;
	max-width: 800px;
	font-size: 14px;
	margin: 0 auto;
	margin-bottom: 30px;
	border-radius: 4px;
}
.instructions .inner {
	padding: 24px;
}
	h2:not(.no-link),
	h3:not(.no-link),
	h4:not(.no-link),
	h5:not(.no-link),
	h6:not(.no-link),
	h1.add-link {
	-webkit-margin-end: -40px;
	-moz-margin-end: -40px;
	margin-inline-end: -40px;
	-webkit-padding-end: 40px;
	-moz-padding-end: 40px;
	padding-inline-end: 40px;
	}
	h2.step-title {
	font-size: 28px !important;
	font-weight: 400 !important;
	line-height: 1em !important;
	margin: 0 0 30px !important;
	color: #3c4043 !important;
	}
	.instructions h2 {
	font-weight: 500;
	margin: 20px 0 0 0;
	font-size: 20px;
	color: #5c5c5c;
	}

	p {
	margin: 16px 0;
	padding: 0;
	color: #5c5c5c;
	}

	/* Exerises */
	.quiz-question-list {
	list-style-position: inside;
	}
	.quiz-question {
	margin: 0 0 30px;
	}
	.quiz-answer {
	-webkit-box-align: start;
	-webkit-align-items: flex-start;
	-moz-box-align: start;
	-ms-flex-align: start;
	align-items: flex-start;
	display: -webkit-box;
	display: -webkit-flex;
	display: -moz-box;
	display: -ms-flexbox;
	display: flex;
	margin: 16px 0;
	position: relative;
	}
	input[type="checkbox"],
	input[type="radio"] {
	margin-top: 0;
	position: relative;
	height: 18px;
	width: 18px;
	margin-right: 10px;
	}
	.buttons-groups{
	min-width:400px;
	display:flex;
	justify-content:space-between;
}

</style>
