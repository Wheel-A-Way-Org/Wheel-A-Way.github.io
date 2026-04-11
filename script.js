const storyScroll = document.querySelector(".story-scroll");
const stackCards = Array.from(document.querySelectorAll(".stack-card"));
const heroBanner = document.querySelector(".hero-banner");
let targetProgress = 0;
let smoothProgress = 0;
let rafId = null;
let heroRafId = null;

function applyCardTransforms(progress) {
  if (stackCards.length === 0) return;
  const cardCount = stackCards.length;
  const segment = 1 / cardCount;
  const cardStep = 520;

  stackCards.forEach((card, index) => {
    const phaseStart = index * segment;
    const phaseProgress = Math.min(Math.max((progress - phaseStart) / segment, 0), 1);
    const finalY = -(cardCount - 1 - index) * cardStep;
    const y = phaseProgress * finalY;
    const scale = 1;
    card.style.transform = `translateY(${y}px) scale(${scale})`;
  });
}

function animate() {
  smoothProgress += (targetProgress - smoothProgress) * 0.04;
  if (Math.abs(targetProgress - smoothProgress) < 0.0006) {
    smoothProgress = targetProgress;
  }

  applyCardTransforms(smoothProgress);

  if (Math.abs(targetProgress - smoothProgress) >= 0.0006) {
    rafId = window.requestAnimationFrame(animate);
  } else {
    rafId = null;
  }
}

function updateTargetFromScroll() {
  if (!storyScroll || stackCards.length === 0) return;

  const rect = storyScroll.getBoundingClientRect();
  const total = Math.max(rect.height - window.innerHeight, 1);

  const traveled = Math.min(Math.max(-rect.top, 0), total);
  targetProgress = traveled / total;

  if (!rafId) {
    rafId = window.requestAnimationFrame(animate);
  }
}

window.addEventListener("scroll", updateTargetFromScroll, { passive: true });
window.addEventListener("resize", updateTargetFromScroll);
updateTargetFromScroll();

function applyHeroParallax() {
  if (!heroBanner) return;

  const rect = heroBanner.getBoundingClientRect();
  const viewport = window.innerHeight || 1;

  if (rect.bottom < 0 || rect.top > viewport) {
    heroBanner.style.setProperty("--hero-parallax-y", "0px");
    return;
  }

  const relative = ((rect.top + rect.height / 2) - viewport / 2) / viewport;
  const shift = Math.max(-18, Math.min(18, -relative * 28));
  heroBanner.style.setProperty("--hero-parallax-y", `${shift.toFixed(2)}px`);
}

function requestHeroParallax() {
  if (heroRafId !== null) return;
  heroRafId = window.requestAnimationFrame(() => {
    heroRafId = null;
    applyHeroParallax();
  });
}

window.addEventListener("scroll", requestHeroParallax, { passive: true });
window.addEventListener("resize", requestHeroParallax);
requestHeroParallax();

const timelineItems = document.querySelectorAll(".timeline-item");

function initTimelineReveal() {
  if (!timelineItems.length) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    timelineItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    timelineItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
  );

  timelineItems.forEach((item) => observer.observe(item));
}

initTimelineReveal();

const p3CriteriaCards = document.querySelectorAll(".p3-criteria-card.reveal-slide");

function initP3CriteriaReveal() {
  if (!p3CriteriaCards.length) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    p3CriteriaCards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    p3CriteriaCards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  p3CriteriaCards.forEach((card) => observer.observe(card));
}

initP3CriteriaReveal();
