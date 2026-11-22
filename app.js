(() => {
  "use strict";

  const slides = window.CMS_SLIDES;
  const byId = (id) => document.getElementById(id);
  if (!Array.isArray(slides) || !slides.length) {
    byId("stage").textContent = "The slides could not be loaded.";
    return;
  }

  const stage = byId("stage");
  const picture = byId("slide-image");
  const indexDialog = byId("slide-index");
  const textButton = byId("show-text");
  const exitButton = byId("exit-presentation");
  const page = byId("page");
  let current = 0;
  let presenting = false;
  let cursorTimer;
  let touchStart = null;
  let lastSwipe = 0;

  function indexFromLocation() {
    const match = /^#slide-(\d+)$/.exec(location.hash);
    return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
  }

  function showText(open) {
    byId("read-panel").hidden = !open;
    textButton.setAttribute("aria-expanded", String(open));
    if (!open) return;
    byId("panel-title").textContent = slides[current].title;
    const paragraphs = slides[current].text || [];
    byId("panel-content").replaceChildren(...paragraphs.map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    }));
  }

  function renderSlide() {
    current = indexFromLocation();
    const slide = slides[current];
    const label = `Slide ${current + 1} of ${slides.length}. ${slide.title}`;
    picture.src = slide.image;
    picture.alt = label;
    byId("previous").disabled = current === 0;
    byId("next").disabled = current === slides.length - 1;
    const number = document.createElement("strong");
    number.textContent = String(current + 1);
    page.replaceChildren(number, document.createTextNode(` / ${slides.length}`));
    byId("announce").textContent = label;
    document.title = `${slide.title} · CMS6002`;
    for (const [n, button] of Array.from(byId("index-grid").children).entries()) {
      if (n === current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    if (!byId("read-panel").hidden) showText(true);
  }

  function goTo(n) {
    const target = Math.max(0, Math.min(slides.length - 1, n));
    if (target === current) return;
    location.hash = `slide-${target + 1}`;
    renderSlide();
  }

  function buildIndex() {
    const cards = slides.map((slide, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "index-card";
      button.setAttribute("aria-label", `Slide ${i + 1}. ${slide.title}`);
      if (i === current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        closeIndex();
        goTo(i);
      });
      const thumb = document.createElement("img");
      thumb.src = slide.image;
      thumb.alt = "";
      thumb.loading = "lazy";
      thumb.decoding = "async";
      const label = document.createElement("span");
      label.className = "index-label";
      const index = document.createElement("span");
      index.textContent = String(i + 1).padStart(2, "0");
      const title = document.createElement("span");
      title.textContent = slide.title;
      label.append(index, title);
      button.append(thumb, label);
      return button;
    });
    byId("index-grid").replaceChildren(...cards);
  }

  function openIndex() {
    if (presenting || indexDialog.open) return;
    if (!byId("index-grid").childElementCount) buildIndex();
    if (indexDialog.showModal) indexDialog.showModal();
    else indexDialog.setAttribute("open", "");
    byId("index-grid").children[current].focus();
  }

  function closeIndex() {
    if (!indexDialog.open) return;
    if (indexDialog.close) indexDialog.close();
    else indexDialog.removeAttribute("open");
    byId("index-open").focus();
  }

  function wakeControls() {
    if (!presenting) return;
    stage.classList.add("awake");
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => stage.classList.remove("awake"), 1400);
  }

  function setProjection(on) {
    presenting = on;
    document.body.classList.toggle("presenting", on);
    exitButton.hidden = !on;
    clearTimeout(cursorTimer);
    stage.classList.remove("awake");
    if (on) stage.focus({ preventScroll: true });
    else byId("present").focus({ preventScroll: true });
  }

  function startPresentation() {
    if (presenting) return;
    setProjection(true);
    const root = document.documentElement;
    try {
      const result = root.requestFullscreen ? root.requestFullscreen() : root.webkitRequestFullscreen?.();
      if (result && typeof result.catch === "function") result.catch(() => {});
    } catch {
      // The fixed stage still fills the browser if native fullscreen is unavailable.
    }
  }

  function endPresentation() {
    if (!presenting) return;
    setProjection(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (document.webkitFullscreenElement) document.webkitExitFullscreen?.();
  }

  function onFullscreenChange() {
    if (presenting && !document.fullscreenElement && !document.webkitFullscreenElement) setProjection(false);
  }

  byId("previous").addEventListener("click", () => goTo(current - 1));
  byId("next").addEventListener("click", () => goTo(current + 1));
  byId("index-open").addEventListener("click", openIndex);
  byId("index-close").addEventListener("click", closeIndex);
  indexDialog.addEventListener("click", (event) => {
    if (event.target !== indexDialog) return;
    const { left, right, top, bottom } = indexDialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) closeIndex();
  });
  textButton.addEventListener("click", () => showText(byId("read-panel").hidden));
  byId("present").addEventListener("click", startPresentation);
  exitButton.addEventListener("click", endPresentation);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  window.addEventListener("hashchange", renderSlide);

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.key === "Tab") return;
    if (indexDialog.open) {
      if (event.key === "Escape") { event.preventDefault(); closeIndex(); }
      return;
    }
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown":
        event.preventDefault(); goTo(current + 1); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp":
        event.preventDefault(); goTo(current - 1); break;
      case " ":
        if (tag !== "BUTTON" && tag !== "A") {
          event.preventDefault(); goTo(current + (event.shiftKey ? -1 : 1));
        }
        break;
      case "Home": event.preventDefault(); goTo(0); break;
      case "End": event.preventDefault(); goTo(slides.length - 1); break;
      case "Escape": if (presenting) { event.preventDefault(); endPresentation(); } break;
      case "f": case "F":
        event.preventDefault();
        if (presenting) endPresentation(); else startPresentation();
        break;
      case "i": case "I": if (!presenting) openIndex(); break;
    }
  });

  stage.addEventListener("pointermove", (event) => { if (event.pointerType !== "touch") wakeControls(); });
  stage.addEventListener("touchstart", (event) => {
    if (event.target === exitButton || event.touches.length !== 1) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
  stage.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      lastSwipe = performance.now();
      goTo(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  stage.addEventListener("click", (event) => {
    if (!presenting || event.target === exitButton || performance.now() - lastSwipe < 400) return;
    const bounds = stage.getBoundingClientRect();
    const portion = (event.clientX - bounds.left) / bounds.width;
    if (portion < .2) goTo(current - 1);
    else if (portion > .8) goTo(current + 1);
    else wakeControls();
  });
  renderSlide();
  if (window.matchMedia("(max-width: 620px) and (orientation: portrait)").matches) showText(true);
})();
