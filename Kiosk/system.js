// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZsj-cL_T_BuLtAz5bkqsw-edZXnumwe0",
  authDomain: "iot-web-58054.firebaseapp.com",
  databaseURL: "https://iot-web-58054-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-web-58054",
  storageBucket: "iot-web-58054.appspot.com",
  messagingSenderId: "949884902967",
  appId: "1:949884902967:web:6e7f78c7cd0fa1484629b2",
  measurementId: "G-5C79490N66"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

let userData = {
  username: "",
  email: "",
  businessName: "",
  product: "",
  tagline: "",
  funding: "",
  purpose: ""
};

let userId = null;
let screenHistory = ["screen1"];

function showScreen(id) {
  const current = document.querySelector(".screen.active");
  if (current && current.id !== id) {
    screenHistory.push(current.id);
  }
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop();
    const previous = screenHistory.pop();
    showScreen(previous);
  }
}

// 🟢 Fix: Make screen1 respond to click
document.getElementById("screen1").addEventListener("click", function () {
  showScreen("screen2");
});

// Step 1: Register
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      userId = userCredential.user.uid;
      return database.ref("users/" + userId).set({ username, email });
    })
    .then(() => {
      userData.username = username;
      userData.email = email;
      showScreen("screen5");
    })
    .catch(error => {
      alert("❌ " + error.message);
    });
});

// Step 2: Business Info
document.getElementById("businessForm1").addEventListener("submit", function (e) {
  e.preventDefault();
  userData.businessName = document.getElementById("bizName").value;
  userData.product = document.getElementById("product").value;
  userData.tagline = document.getElementById("tagline").value;
  showScreen("screen6");
});

// Step 3: Funding Info and Save to Firebase
document.getElementById("businessForm2").addEventListener("submit", function (e) {
  e.preventDefault();
  userData.funding = document.getElementById("funding").value;
  userData.purpose = document.getElementById("purpose").value;

  if (userId) {
    database.ref("users/" + userId + "/businessInfo").set({
      businessName: userData.businessName,
      product: userData.product,
      tagline: userData.tagline,
      funding: userData.funding,
      purpose: userData.purpose
    })
    .then(() => {
      const container = document.getElementById("reviewContainer");
      container.innerHTML = `
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Business Name:</strong> ${userData.businessName}</p>
        <p><strong>Product:</strong> ${userData.product}</p>
        <p><strong>Tagline:</strong> ${userData.tagline}</p>
        <p><strong>Funding Goal:</strong> ₱${userData.funding}</p>
        <p><strong>Purpose:</strong> ${userData.purpose}</p>
      `;
      showScreen("screen7");
    })
    .catch(error => {
      alert("❌ " + error.message);
    });
  }
});
