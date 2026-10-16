const pageTransitionKey = "page-cta-transition";
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (sessionStorage.getItem(pageTransitionKey) === "pending") {
  sessionStorage.removeItem(pageTransitionKey);
  if (!prefersReducedMotion) {
    document.body.classList.add("page-transition-in");
  }
}

const navbar = document.querySelector(".navbar");
const navbarNav = document.querySelector(".navbar-nav");
const menuButton = document.querySelector("#menu");

if (navbar && navbarNav && menuButton) {
  const menuIcon = menuButton.querySelector("i");

  const setMenuOpen = (isOpen) => {
    navbarNav.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Tutup menu" : "Buka menu",
    );
    if (menuIcon) {
      menuIcon.classList.toggle("bx-menu", !isOpen);
      menuIcon.classList.toggle("bx-x", isOpen);
    }
  };

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", (event) => {
    event.preventDefault();
    setMenuOpen(!navbarNav.classList.contains("active"));
  });

  navbarNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navbarNav.classList.contains("active")) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}

document
  .querySelectorAll(".page-cta, .hero .content .cta, .navbar-nav a")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        prefersReducedMotion ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      event.preventDefault();
      sessionStorage.setItem(pageTransitionKey, "pending");
      document.body.classList.add("page-transition-out");
      window.setTimeout(() => {
        window.location.assign(destination.href);
      }, 320);
    });
  });

const memberSearch = document.querySelector("#member-search");
const memberCards = [...document.querySelectorAll(".member-grid .member-card")];
const memberCount = document.querySelector("#member-count");

if (memberSearch && memberCards.length) {
  const updateMemberList = () => {
    const query = memberSearch.value.trim().toLocaleLowerCase("id");
    let visibleCount = 0;

    memberCards.forEach((card) => {
      const matches = card.textContent.toLocaleLowerCase("id").includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (memberCount) {
      memberCount.textContent = `${visibleCount} anggota ditemukan`;
    }
  };

  memberSearch.addEventListener("input", updateMemberList);
  updateMemberList();
}

const revealTargets = document.querySelectorAll(
  ".hero .content, .about, .member-list, .structure, .contact, .member-card, .contact-card",
);

if (
  revealTargets.length &&
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.body.classList.add("has-scroll-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
  });
}

const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "Kembali ke atas");
backToTop.textContent = "↑";
document.body.append(backToTop);

const updateBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 300);
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
});
