function addOrRemoveClass(add, remove, className) {
  className.classList.remove(remove);
  className.classList.add(add);
}

const settingBTNs = document.querySelectorAll(".post-setting span");
const settingOptions = document.querySelectorAll(".setting-option");

settingBTNs.forEach((settingBTN, i) => {
  settingBTN.addEventListener("click", () => {
    switch (settingOptions[i].classList[1]) {
      case "disappear":
        addOrRemoveClass("appear", "disappear", settingOptions[i]);
        break;
      case "appear":
        addOrRemoveClass("disappear", "appear", settingOptions[i]);
        break;
      default:
        break;
    }
  });
});

async function sendData(e) {
  let match = e.value.match(/[^a-zA-Z0-9]/g);
  let match2 = e.value.match(/\s*/);
  const searchResult = document.querySelector(".search-result");
  const inboxSearchResult = document.querySelector(".inbox-search-result");
  console.log(e.name);
  if (e.value.length === 0) {
    addOrRemoveClass("disappear", "appear", searchResult);
    addOrRemoveClass("disappear", "appear", inboxSearchResult);
  } else {
    if (match2[0] === e.value) {
      searchResult.innerHTML = ``;
      return;
    }
    if (match !== e.value) {
      const response = await fetch("http://localhost:3000/getUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: e.value }),
      });
      const userDetail = await response.json();
      const payload = userDetail.payload;

      if (e.name === "nav-search") {
        addOrRemoveClass("appear", "disappear", searchResult);
        if (payload.length < 1) {
          searchResult.innerHTML = `<p>No result found</p>`;
        } else {
          const username = [];
          payload.forEach((user) => {
            username.push(
              `<p><a href="/user/profile/${user.username}">${user.username}</a></p>`
            );
          });
          searchResult.innerHTML = username.join("");
        }
      } else if (e.name === "inbox-search") {
        addOrRemoveClass("appear", "disappear", inboxSearchResult);
        if (payload.length < 1) {
          inboxSearchResult.innerHTML = `<p>No result found</p>`;
        } else {
          const username = [];
          payload.forEach((user) => {
            username.push(
              `<p><a href="/direct/${user._id}">${user.username}</a></p>`
            );
          });
          inboxSearchResult.innerHTML = username.join("");
        }
      }
    }
  }
}

const likeButtons = document.querySelectorAll(".like-btn");
const likedUserId = document.querySelectorAll(".liked-user-id");
const postLikeTexts = document.querySelectorAll(".post-likes span");

likeButtons.forEach((likeButton, i) => {
  likeButton.addEventListener("click", async () => {
    const unlikeUrl = "http://localhost:3000/unlikes";
    const likeUrl = "http://localhost:3000/likes";
    likeButton.classList.toggle("fa-solid");
    const url = likeButton.classList.contains("fa-solid") ? likeUrl : unlikeUrl;
    url === unlikeUrl &&
      likeButton.classList.remove("fa-solid") &&
      likeButton.classList.add("fa-regular");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like: likedUserId[i].name }),
    });

    const like = await response.json();
    const likeCount = like.likeCount;

    //Control the count of the likes
    postLikeTexts[i].textContent = likeCount;
  });
});
