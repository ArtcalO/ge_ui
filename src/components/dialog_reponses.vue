<template>
		<dialog-overlay class="massive-dialog" id="reponses_exercices">
			<div >
				<div id="steps">
					<div class="content">
						<div class="instructions">
												
							<div class="inner">
								<div class="buttons-groups">
										<h2 class="step-title">Exerices</h2>
										<v-text color="bg-secondary" >
												 Reponses tourvées : {{found_answer.length}}/ {{correctionExerciceProps.length}}
										</v-text>
										<v-text color="bg-secondary" >
												 Score : {{score}}/100
										</v-text>
								</div>
								<form class="quiz-body" @submit.prevent>
									<ol class="quiz-question-list">
										<li
											class="quiz-question"
											v-for="(item,i) in correctionExerciceProps"
											:data-index="i"
											data-type="multiple_choice_single_answer"
											:key="item.id"
											:class="{body_success:item.trouve,body_danger:!item.trouve}"
										>
											<span class="quiz-question-header">{{item.exercice.question}}</span>

											<section class="quiz-answers">
												<div v-for="(el,i) in shuffleArray([item.exercice.reponse,item.exercice.mauvaise_reponse1,item.exercice.mauvaise_reponse2,item.exercice.mauvaise_reponse3])" :key="i" class="quiz-answer" :data-index="i">
														<input
																type="radio"
																class="form-check-input"
																:value="el"
																:id="item.id"
																:name="item.id"
																v-model="item.reponse"
																disabled
														/>
														<label for="question-0-0">{{el}}</label>
														<div class="quiz-feedback"></div>
												</div>
											</section>
										</li>
										<div class="buttons-groups">
											<v-btn v-if="score<80" @click="closeModal()" class="btn btn-primary" color="primary" type="submit">Refaire</v-btn>
											<br>
										<v-btn v-if="score>=80" @click="quit()" class="btn btn-primary" color="secondary" type="submit">Quitter</v-btn>
										</div>
										
									</ol>
								</form>
							</div>
						</div>
					</div>
				</div>
		</div>
	</dialog-overlay>
</template>

<script>
import dialogOverlay from "./dialogOverlay.vue";

export default {
		components: { dialogOverlay },
		props: ["correctionExerciceProps"],
		methods: {
				upsert(array, element) { // (1)
						const i = array.findIndex(_element => _element.q_id === element.q_id);
						if (i > -1) array[i] = element; // (2)
						else array.push(element);
				},
				shuffleArray(array) {
						for (let i = array.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1));
								[array[i], array[j]] = [array[j], array[i]];
						}
						return array
				},
		},
		computed: {
			found_answer() {
				return this.correctionExerciceProps.filter(x=>x.trouve==true);
			},
			score(){
				return parseInt(this.found_answer.length*100/this.correctionExerciceProps.length)
			},
			quit(){
				const reponses_exercices = document.querySelector("#reponses_exercices");
				if (reponses_exercices) {
          	reponses_exercices.close();
          	this.$router.go(-1)
        }
			}
		},

};
</script>

<style scoped>
h3 {
		padding: 16px 0;
}
.btn-group {
		display: flex;
		padding-top: 16px;
		border-top: 1px solid var(--color-soft-grey);
		gap: 8px;
}
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
		padding:10px;
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
dialog-overlay{
		width:500px;
}
.body_danger{
	background-color:#f5424273;	
}
.header_danger{
	background-color:#f54242bd;
}

.body_success{
	background-color:#6eff619c;
}
.header_success{
	background-color:#6eff61;
}
.space{
	margin-right:20px;
}
</style>

