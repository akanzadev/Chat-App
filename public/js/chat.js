const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const txtUid = $("#txtUid");
const txtMensaje = $("#txtMensaje");
const ulUsuarios = $("#ulUsuarios");
const ulMensajes = $("#ulMensajes");
const btnSalir = $("#btnSalir");

let usuario = null;
let socket = null;

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://node-app-cafe-super.herokuapp.com/api/auth/";

// Validar token de local storage
const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location.href = "./index.html";
    throw new Error("Token no valido");
  }
  const respuesta = await fetch(`${url}`, {
    headers: {
      Authorization: token,
    },
  });
  const { user: userDB, token: tokenDB } = await respuesta.json();
  window.localStorage.setItem("token", tokenDB);
  usuario = userDB;
  document.title = usuario.name;
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      Authorization: localStorage.getItem("token"),
    },
  });
  socket.on("connect", () => {
    console.log("Conectado al servidor");
  });
  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });

  socket.on("recibir-mensaje", () => {
    // TODO: recibir mensaje
  });
  socket.on("usuarios-activos", (payload) => {
    // TODO: recibir mensaje
    console.log(payload);
  });
  socket.on("mensaje-privado", () => {
    // TODO: recibir mensaje
  });
};

const main = async () => {
  await validarJWT();
};

main();
