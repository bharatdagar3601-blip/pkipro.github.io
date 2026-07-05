// PKI Pro — site script (no build step, plain JS for GitHub Pages)

document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    /* Safety net: if for any reason an element never intersects
       (fast scroll, tall section, observer glitch), force it
       visible after a short delay so nothing stays blank forever. */
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("in"));
    }, 2500);
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Hero terminal — loops a short, believable sample sign log,
     mirroring the product's own Live Execution Log panel. */
  const logBody = document.getElementById("heroLog");
  if (!logBody) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sample = [
    { t: "14:02:07", ok: true, text: "Token link established -> Slot 0 (ProtectServer HSM)" },
    { t: "14:02:08", ok: true, text: "Signed item -> Vendor_Agreement_0417.pdf" },
    { t: "14:02:08", ok: true, text: "Signed item -> PO_Invoice_2291.pdf" },
    { t: "14:02:09", ok: true, text: "Signed item -> Board_Resolution_Q2.pdf" },
    { t: "14:02:09", ok: true, text: "Batch complete -> 3 signed, 0 failed" },
  ];

  function renderLine(entry) {
    const div = document.createElement("div");
    div.className = "log-line";
    div.innerHTML = `<span class="tag">[${entry.t}]</span> ${
      entry.ok ? '<span class="ok">SUCCESS:</span>' : ""
    } ${entry.text}`;
    return div;
  }

  function runOnce() {
    logBody.innerHTML = "";
    const stamp = document.getElementById("heroStamp");
    if (stamp) stamp.style.animation = "none";

    sample.forEach((entry, i) => {
      setTimeout(() => {
        const line = renderLine(entry);
        line.style.animationDelay = "0s";
        logBody.appendChild(line);
      }, prefersReduced ? 0 : i * 480);
    });

    // retrigger the checkmark draw-in after lines finish
    setTimeout(() => {
      if (stamp) {
        stamp.style.animation = "none";
        // force reflow so the animation restarts
        void stamp.offsetWidth;
        stamp.style.animation = "draw 0.6s ease 0s forwards";
      }
    }, prefersReduced ? 50 : sample.length * 480 + 200);
  }

  runOnce();
  if (!prefersReduced) {
    setInterval(runOnce, 6500);
  }

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Demo request form -> opens the visitor's email client, prefilled */
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(demoForm);
      const name = data.get("name") || "";
      const company = data.get("company") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const message = data.get("message") || "";

      const subject = `Demo request — ${company || name}`;
      const body =
        `Name: ${name}\n` +
        `Company: ${company}\n` +
        `Work email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `What they'd like to see:\n${message}`;

      window.location.href =
        `mailto:info@pkipro.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
