document.getElementById("ham").addEventListener("click", () => {
  document.querySelector(".menus").classList.toggle("menu-active");
  document.getElementById("ham").style.display = "none";
});

document.getElementById("closeButton").addEventListener("click", () => {
  var menu = document.querySelector(".menus");

  // Disable the transition for an immediate close effect
  menu.classList.add("no-transition");
  document.getElementById("ham").style.display = "block";
  // Listen for the next time the browser renders, then remove menu-active
  requestAnimationFrame(function () {
    menu.classList.remove("menu-active");

    // Restore the transition after the menu is closed so it works next time
    // Use a setTimeout to push it to the end of the call stack
    setTimeout(function () {
      menu.classList.remove("no-transition");
    });
  });
});

//input holders
const fullName = document.getElementById("fullName");
const email = document.getElementById("emailId");
const message = document.getElementById("Message");
//error message holders
let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let messageError = document.getElementById("messageError");
let submitError = document.getElementById("submitError");

const validIcon = document.getElementById("validNameIcon");
const emailValidIcon = document.getElementById("emailValidIcon");

function validateName() {
  if (fullName.value.length == 0) {
    nameError.innerHTML = `Name cannot be empty.`;
    validIcon.classList.add("default-hide");
    return false;
  } else if (!fullName.value.match(/^[A-Za-z]*\s{1}[A-Za-z]+$/)) {
    nameError.innerHTML = `Please enter the full name. No middlename is required.`;
    validIcon.classList.add("default-hide");
    return false;
  } else {
    nameError.innerHTML = "";
    validIcon.classList.remove("default-hide");
    return true;
  }
}

function validateEmail() {
  if (email.value.length == 0) {
    emailError.innerHTML = `Email cannot be empty.`;
    emailValidIcon.classList.add("default-hide");
    return false;
  } else if (
    !email.value.match(/^[A-Za-z0-9._]+@[A-Za-z0-9.-]+\.[a-z]{2,6}$/)
  ) {
    emailError.innerHTML = `Invalid email.`;
    emailValidIcon.classList.add("default-hide");
    return false;
  } else {
    emailError.innerHTML = "";
    emailValidIcon.classList.remove("default-hide");
    return true;
  }
}

function validateMessage() {
  if (message.value.length == 0) {
    messageError.innerHTML = `Message cannot be empty.`;
    return false;
  } else {
    messageError.innerHTML = "";
    return true;
  }
}

function validateForm() {
  if (!validateName() || !validateEmail() || !validateMessage()) {
    submitError.innerHTML = `Cannot submit form. Please fix the error.`;
    setTimeout(() => {
      submitError.innerHTML = "";
    }, 2000);
    return false;
  } else return true;
}

const handleSubmit = (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  } else {
    const myForm = event.target;
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        alert("Thank you for your submission");
        myForm.reset();
        validIcon.classList.add("default-hide");
        emailValidIcon.classList.add("default-hide");
      })
      .catch((error) => alert(error));
  }
};

document.querySelector("form").addEventListener("submit", handleSubmit);
