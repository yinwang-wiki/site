(function () {
  var root = document.documentElement;
  var sidebar = document.getElementById("git-wiki-sidebar");
  var sidebarToggle = document.getElementById("sidebar-toggle");
  var sidebarClose = document.getElementById("sidebar-close");
  var themeToggles = Array.prototype.slice.call(document.querySelectorAll(".theme-toggle"));
  var toc = document.querySelector(".wiki-toc");
  var wideLayout = window.matchMedia("(min-width: 1280px)");
  var mobileLayout = window.matchMedia("(max-width: 992px)");

  function currentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function updateThemeControls() {
    var isDark = currentTheme() === "dark";
    themeToggles.forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到暗色模式");
    });
  }

  function toggleTheme() {
    var nextTheme = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    try { localStorage.setItem("site-theme", nextTheme); } catch (error) {}
    updateThemeControls();
  }

  function setSidebar(open) {
    if (!sidebar) return;
    sidebar.classList.toggle("is-open", open);
    sidebar.setAttribute("aria-hidden", String(!open && window.innerWidth <= 992));
    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", String(open));
      sidebarToggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    }
  }

  function syncToc(event) {
    if (!toc) return;
    toc.open = event.matches;
  }

  function syncSidebar(event) {
    if (!event.matches) setSidebar(false);
    else if (sidebar) sidebar.setAttribute("aria-hidden", String(!sidebar.classList.contains("is-open")));
  }

  themeToggles.forEach(function (button) { button.addEventListener("click", toggleTheme); });
  if (sidebarToggle) sidebarToggle.addEventListener("click", function () { setSidebar(!sidebar.classList.contains("is-open")); });
  if (sidebarClose) sidebarClose.addEventListener("click", function () { setSidebar(false); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setSidebar(false);
  });
  if (wideLayout.addEventListener) wideLayout.addEventListener("change", syncToc);
  if (mobileLayout.addEventListener) mobileLayout.addEventListener("change", syncSidebar);

  syncToc(wideLayout);
  syncSidebar(mobileLayout);
  updateThemeControls();
})();
