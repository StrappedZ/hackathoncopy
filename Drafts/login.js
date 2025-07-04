// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/+esm";

const firebaseConfig = {
  apiKey: "AIzaSyDZsj-cL_T_BuLtAz5bkqsw-edZXnumwe0",
  authDomain: "iot-web-58054.firebaseapp.com",
  databaseURL: "https://iot-web-58054-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-web-58054",
  storageBucket: "iot-web-58054.appspot.com",
  messagingSenderId: "949884902967",
  appId: "1:949884902967:web:d580b43eaf34040c4629b2",
  measurementId: "G-8NXYYY4ETV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const msg = document.getElementById('loginErrorMsg');
  msg.style.display = 'none';
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: 'success',
        title: 'Logged in!',
        text: 'You have successfully logged in.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "../index.html";
      });
    })
    .catch((error) => {
      msg.textContent = error.message || "Login failed.";
      msg.style.display = 'block';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message.replace("Firebase:", ""),
        confirmButtonColor: '#1976d2'
      });
    });
});