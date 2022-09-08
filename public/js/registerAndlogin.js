const form = document.querySelector(".form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.querySelectorAll(".error");
const errorText = document.querySelectorAll(".error span");

let i, j;

const removeAndAddErrorMarks = (
  errorText,
  error,
  textContent,
  addClass,
  removeClass,
  input,
  borderColor
) => {
  errorText.textContent = textContent;
  error.classList.remove(removeClass);
  error.classList.add(addClass);
  input.style.borderColor = borderColor;
};

if (email !== null) {
  i = 0;
  j = 2;

  email.addEventListener("mouseout", () => {
    if (email.value.length != 0) {
      const filter =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!filter.test(email.value)) {
        removeAndAddErrorMarks(
          errorText[1],
          error[1],
          "Please provide valid email address",
          "appear",
          "disappear",
          email,
          "red"
        );
      } else {
        removeAndAddErrorMarks(
          errorText[1],
          error[1],
          "",
          "disappear",
          "appear",
          email,
          "#ADADAD"
        );
      }
    }
  });
} else {
  i = 0;
  j = 1;
}

username.addEventListener("mouseout", () => {
  let user = username.value;
  if (user.length != 0) {
    if (user.match(/[^a-zA-Z0-9]/g)) {
      removeAndAddErrorMarks(
        errorText[i],
        error[i],
        "Sorry, only letters (a-z), numbers (0-9) are allowed",
        "appear",
        "disappear",
        username,
        "red"
      );
    } else if (user.length < 6 || user.length > 20) {
      removeAndAddErrorMarks(
        errorText[i],
        error[i],
        "Sorry,username must be between 6 to 20 characters long",
        "appear",
        "disappear",
        username,
        "red"
      );
    } else {
      removeAndAddErrorMarks(
        errorText[i],
        error[i],
        "",
        "disappear",
        "appear",
        username,
        "#ADADAD"
      );
    }
  }
});


password.addEventListener("mouseout", () => {
  if (password.value.length !== 0) {
    if (password.value.length < 8) {
      removeAndAddErrorMarks(
        errorText[j],
        error[j],
        "Sorry,password must be 8 or more characters long ",
        "appear",
        "disappear",
        password,
        "red"
      );
    } else if (
      password.value === "12345678" ||
      password.value === "qwertyui" ||
      password.value === "password" ||
      password.value === "PASSWORD"
    ) {
      removeAndAddErrorMarks(
        errorText[2],
        error[2],
        "Sorry,password is to Easy",
        "appear",
        "disappear",
        password,
        "red"
      );
    } else {
      removeAndAddErrorMarks(
        errorText[j],
        error[j],
        "",
        "disappear",
        "appear",
        password,
        "#ADADAD"
      );
    }
  }
});