const followButtons = document.querySelectorAll(".follow-unfollow-btn input");
const usersUsername = document.querySelector(".username h2");



function addOrRemoveClass(add, remove, className) {
  className.classList.remove(remove);
  className.classList.add(add);
}

followButtons.forEach((followBtn,i) => {
  followBtn.addEventListener("click", async () => {
    
    if (followBtn.value === "Follow") {
      fetch("http://localhost:3000/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: usersUsername.textContent }),
      });
      followBtn.value = "Following";
      addOrRemoveClass("following-btn", "follow-btn", followBtn);
    }

    if (followBtn.value === "Unfollow") {
      fetch("http://localhost:3000/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: usersUsername.textContent }),
      });
      followBtn.value = "Follow";
      addOrRemoveClass("follow-btn", "unfollow-btn", followBtn);
    }
  });

  followBtn.addEventListener("mouseover", () => {
    if (followBtn.value === "Following") {
      followBtn.value = "Unfollow";
      addOrRemoveClass("unfollow-btn", "following-btn", followBtn);
    }

    if (followBtn.value === "Follow") {
      followBtn.classList.remove("follow-btn");
      followBtn.classList.add("follow-btn-hover");
      addOrRemoveClass("follow-btn-hover", "follow-btn", followBtn);
    }
  });

  followBtn.addEventListener("mouseout", () => {
    if (followBtn.value === "Unfollow") {
      followBtn.value = "Following";
      addOrRemoveClass("following-btn", "unfollow-btn", followBtn);
    }

    if (followBtn.value === "Follow") {
      addOrRemoveClass("follow-btn", "follow-btn-hover", followBtn);
    }
  });
});