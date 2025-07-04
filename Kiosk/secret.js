(function() {
  let secret = "";
  document.addEventListener("keydown", function(e) {
    secret += e.key.toLowerCase();
    if (secret.includes("pesimo")) {
      window.location.href = "../admin/adminlogin.html";
    }
    if (secret.length > 20) secret = secret.slice(-20);
  });
})();
