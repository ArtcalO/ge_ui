<template>
	<div>
		<div class="login-page_container">
			<!--       Sign in Side      -->
			<login-page />
			<!--       Sign up Side      -->
			<register-page />
		</div>
	</div>
</template>

<script>
import LoginPage from "./LoginPage.vue";
import RegisterPage from "./RegisterPage.vue";
export default {
	components: { LoginPage, RegisterPage },
	mounted() {
		let loginSide = document.querySelector(".login-section");
		let registerSide = document.querySelector(".signup-section");
		let loginForm = document.querySelector(".login-form");
		let registerForm = document.querySelector(".signup-form");
		loginForm.classList.add("no-pointer");
		registerForm.classList.add("no-pointer");

		loginSide.addEventListener("click", () => {
			loginSide.classList.add("section-open");
			loginSide.classList.remove("section-close");
			registerSide.classList.add("section-close");
			registerSide.classList.remove("section-open");
			loginForm.classList.remove("no-pointer");
			registerForm.classList.add("no-pointer");
		});

		registerSide.addEventListener("click", () => {
			registerSide.classList.add("section-open");
			registerSide.classList.remove("section-close");
			loginSide.classList.add("section-close");
			loginSide.classList.remove("section-open");
			loginForm.classList.add("no-pointer");
			registerForm.classList.remove("no-pointer");
			// document.querySelector(".login-form").slideDown();
			// document.querySelector(".forget-form").slideUp();
		});

		document
			.querySelector(".login-page_input")
			.addEventListener("change", (e) => {
				let input = e.target;
				if (input.value.length) {
					input.classList.add("hide-placeholder");
				} else {
					input.classList.remove("hide-placeholder");
				}
			});

		let a = document.querySelector(".login-page_forget a");
		a.addEventListener("click", (e) => {
			e.preventDefault();

			document.querySelector(".login-form").style.display = "none";
			document.querySelector(".forget-form").style.display = "block";
		});

		let goLogin = document.querySelector(".go-login");
		goLogin.addEventListener("click", () => {
			document.querySelector(".login-form").style.display = "block";
			document.querySelector(".forget-form").style.display = "none";
		});
	},
};
</script>

<style src="../../theme/account.css"></style>
