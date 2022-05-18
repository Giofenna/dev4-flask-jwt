function register(e) {
  // Check if passwords match

  if (getValue(password1) != getValue(confirm)) {
    console.log("error, non-matching pw");
  }
  // Fetch data from html
  data = {
    wachtwoord: getValue("password1"),
    email: getValue("email1"),
    voornaam: getValue("firstname"),
    achternaam: getValue("lastname"),
    tussenvoegsel: null,
  };

  // Submit data to API
  api("klanten", "POST", data).then((res) => {
    if (res.message == "success") alert("User created");
  });
}

function login() {
  // Fetch data from html
  data = { email: getValue("email2"), wachtwoord: getValue("password2") };
  // Submit data to API
  api("auth", "POST", data).then((res) => {
    if (res.message == "success") {
      alert("Logged in");
      setCookie("token", res.access_token, 365);
      showPage('mainPage');
      getUser();
    }
  });
}

function getUser() {
    api("me", "GET").then(res=>console.log(res))
  // Fetch user data from API
}

function logout() {}

// Helper functions

function showPage(id) {
  let pages = document.getElementsByClassName("container");
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  document.getElementById(id).style.display = "block";
}

function bindEvents() {
  connectButton("register", register);
  connectButton("login", login);
  enableSubmits();
}

function enableSubmits() {
  document.body.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      // if enter is pressed
      console.log(e);
      let target = e.target;
      while (!target.className.includes("input")) {
        console.log(target);
        target = target.parentElement;
      }
      target.parentElement.getElementsByTagName("button")[0].click(); // click the first button
    }
  });
}

function connectButton(id, event) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", event);
  }
}

function getValue(id) {
  let element = document.getElementById(id);
  if (element) {
    return element.value;
  }
  return "";
}

function api(endpoint, method = "GET", data = {}) {
  const API = "http://localhost:5000/";
  return fetch(API + endpoint, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("token"),
    },
    body: method == "GET" ? null : JSON.stringify(data),
  }).then((res) => res.json());
}

// Cookie functions stolen from w3schools (https://www.w3schools.com/js/js_cookies.asp)
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(cname) {
  setCookie(cname, "", -1);
}

bindEvents();
