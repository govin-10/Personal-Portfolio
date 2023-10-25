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
