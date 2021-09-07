const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://node-app-cafe-super.herokuapp.com/api/auth/";

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  const id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
  fetch(url + "google", {
    body: JSON.stringify({ id_token }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      const { token } = data;
      window.localStorage.setItem("token", token);        
      window.location.href = "./chat.html";
    });
}
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}

const formLogin = $("#form-login");
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {};
  for (const node of formLogin.elements) {
    if (node.name) {
      formData[node.name] = node.value;
    }
  }
  fetch(url + "login", {
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Ok!",
          text: data.message,
        });
        window.localStorage.setItem("token", data.token);
        window.location.href = "./chat.html";
      } else if (data.statusCode === 400) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    })
    .catch((err) => {
      alert("Error: " + err.message);
    });
});
