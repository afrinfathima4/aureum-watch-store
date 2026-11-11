/* AUREUM – site-wide behaviour.
   Depends on products.js and cart.js (load order: products, cart, smudge, main). */

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const ICONS = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l16 16M20 4 4 20"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5v-5Z"/></svg>'
  };

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- toast ---------- */
  function toast(message) {
    let wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = message;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  /* ---------- shared header & footer ---------- */
  function currentAttr(name) { return page === name ? ' aria-current="page"' : ""; }

  function renderChrome() {
    const header = $("#site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML =
        '<div class="container"><nav class="nav" id="nav" aria-label="Main navigation">' +
        '<button class="icon-btn nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu"><span class="bars"></span></button>' +
        '<ul class="nav__links" id="nav-links">' +
        '<li><a href="index.html"' + currentAttr("index.html") + '>Home</a></li>' +
        '<li><a href="index.html#shop">Shop</a></li>' +
        '<li><a href="about.html"' + currentAttr("about.html") + '>About Us</a></li>' +
        '<li><a href="about.html#contact">Contact</a></li>' +
        '</ul>' +
        '<a class="logo" href="index.html" aria-label="Aureum – home">AUREUM<small>HOROLOGIE</small></a>' +
        '<div class="nav__actions">' +
        '<button class="icon-btn" type="button" data-open-search aria-label="Search watches">' + ICONS.search + '</button>' +
        '<a class="icon-btn" href="account.html" aria-label="Account"' + currentAttr("account.html") + '>' + ICONS.user + '</a>' +
        '<a class="icon-btn" href="cart.html" aria-label="Shopping cart">' + ICONS.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
        '</div></nav></div>';
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.innerHTML =
        '<div class="container"><div class="footer__grid">' +
        '<div class="footer__brand"><a class="logo" href="index.html">AUREUM<small>HOROLOGIE</small></a>' +
        '<p>Considered timepieces for those who measure life in moments, not minutes. Designed with patience, finished by hand.</p>' +
        '<div class="socials">' +
        '<a href="index.html#newsletter" aria-label="Instagram">' + ICONS.instagram + '</a>' +
        '<a href="index.html#newsletter" aria-label="Facebook">' + ICONS.facebook + '</a>' +
        '<a href="index.html#newsletter" aria-label="X">' + ICONS.x + '</a>' +
        '<a href="index.html#newsletter" aria-label="YouTube">' + ICONS.youtube + '</a></div></div>' +
        '<div><h4>Quick Links</h4><ul>' +
        '<li><a href="index.html">Home</a></li><li><a href="index.html#shop">Shop</a></li>' +
        '<li><a href="about.html">About Us</a></li><li><a href="account.html">My Account</a></li><li><a href="cart.html">Cart</a></li></ul></div>' +
        '<div><h4>Collections</h4><ul>' +
        COLLECTIONS.map((c) => '<li><a href="index.html?collection=' + c.id + '#shop">' + esc(c.name) + '</a></li>').join("") + '</ul></div>' +
        '<div><h4>Customer Support</h4><ul>' +
        '<li><a href="about.html#contact">Contact us</a></li><li><a href="about.html#contact">Shipping &amp; returns</a></li>' +
        '<li><a href="about.html#contact">Warranty &amp; care</a></li><li><a href="about.html#contact">Book a viewing</a></li></ul></div>' +
        '</div><div class="footer__bottom"><span>&copy; ' + new Date().getFullYear() + ' Aureum Horologie. All rights reserved.</span>' +
        '<span>Crafted with patience.</span></div></div>';
    }

    // search overlay
    const panel = document.createElement("div");
    panel.className = "search-panel";
    panel.id = "search-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Search");
    panel.innerHTML =
      '<button class="icon-btn search-panel__close" type="button" data-close-search aria-label="Close search">' + ICONS.close + '</button>' +
      '<div class="search-panel__inner"><label class="visually-hidden" for="search-input">Search watches</label>' +
      '<input class="search-field" id="search-input" type="search" placeholder="Search watches…" autocomplete="off">' +
      '<div class="search-results" id="search-results" aria-live="polite"></div></div>';
    document.body.appendChild(panel);
  }

  /* ---------- nav behaviour ---------- */
  function initNav() {
    const header = $("#site-header");
    const nav = $("#nav");
    if (!header || !nav) return;

    const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".nav__toggle", nav);
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    $$(".nav__links a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) setOpen(false); });
  }

  /* ---------- search ---------- */
  function initSearch() {
    const panel = $("#search-panel");
    const input = $("#search-input");
    const results = $("#search-results");
    if (!panel) return;
    let opener = null;

    function open(trigger) {
      opener = trigger || null;
      panel.classList.add("is-open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render("");
      setTimeout(() => input.focus(), 50);
    }
    function close() {
      panel.classList.remove("is-open");
      document.body.style.overflow = "";
      if (opener) opener.focus();
    }
    function render(q) {
      const term = q.trim().toLowerCase();
      results.innerHTML = "";
      const list = term
        ? PRODUCTS.filter((p) => (p.name + " " + p.category + " " + p.short + " " + p.description).toLowerCase().includes(term))
        : PRODUCTS.slice(0, 4);
      if (!list.length) {
        const p = document.createElement("p");
        p.className = "search-empty";
        p.textContent = 'No watches match "' + q.trim() + '". Try "chronograph" or "classic".';
        results.appendChild(p);
        return;
      }
      list.slice(0, 8).forEach((p) => {
        const a = document.createElement("a");
        a.className = "search-result";
        a.href = "product-details.html?id=" + encodeURIComponent(p.id);
        a.innerHTML = '<img src="' + p.image + '" alt="" width="76" height="76"><div><h3>' + esc(p.name) + '</h3><span>' + esc(p.category) + '</span></div><span>' + formatPrice(p.price) + '</span>';
        results.appendChild(a);
      });
    }

    document.addEventListener("click", (e) => {
      const o = e.target.closest("[data-open-search]");
      if (o) { open(o); return; }
      if (e.target.closest("[data-close-search]")) close();
    });
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = $("a", results);
        if (first) location.href = first.href;
      }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("is-open")) close(); });
    panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }
  function observeNew(root) {
    // for dynamically rendered content: reveal immediately with a gentle stagger
    $$(".reveal:not(.is-visible)", root).forEach((el, i) => { el.style.setProperty("--d", (i * 0.06) + "s"); requestAnimationFrame(() => el.classList.add("is-visible")); });
  }

  /* ---------- product cards ---------- */
  function productCard(p, tag) {
    const url = "product-details.html?id=" + encodeURIComponent(p.id);
    return '<article class="product-card reveal">' +
      '<a class="product-card__media" href="' + url + '" aria-label="View ' + esc(p.name) + '">' +
      (tag ? '<span class="tag">' + tag + '</span>' : '') +
      '<img src="' + p.image + '" alt="' + esc(p.name) + ' watch" loading="lazy" width="600" height="600"></a>' +
      '<div class="product-card__body"><span class="product-card__cat">' + esc(p.category) + '</span>' +
      '<h3><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
      '<p class="product-card__desc">' + esc(p.short) + '</p>' +
      '<div class="product-card__row"><span class="price">' + formatPrice(p.price) + '</span></div>' +
      '<div class="product-card__actions">' +
      '<button class="btn btn--solid btn--small" type="button" data-add="' + p.id + '">Add to Cart</button>' +
      '<a class="btn btn--small" href="' + url + '">Details</a></div></div></article>';
  }

  function fillGrid(grid, list, tagFn) {
    if (!grid) return;
    grid.innerHTML = list.length
      ? list.map((p) => productCard(p, tagFn ? tagFn(p) : "")).join("")
      : '<p class="empty-note">No watches found in this collection yet.</p>';
    observeNew(grid);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const p = getProduct(btn.getAttribute("data-add"));
    if (!p) return;
    Cart.add(p.id, 1);
    toast(p.name + " added to your cart");
  });

  /* ---------- home page ---------- */
  function initHome() {
    const colWrap = $("#collections");
    const featured = $("#featured-grid");
    if (!colWrap || !featured) return;

    let active = "all";
    const titleNote = $("#featured-note");

    colWrap.innerHTML = COLLECTIONS.map((c, i) =>
      '<button class="collection-card reveal" type="button" data-collection="' + c.id + '" style="--d:' + (i * 0.08) + 's" aria-pressed="false">' +
      '<img src="' + c.image + '" alt="" loading="lazy"><div class="collection-card__label"><h3>' + esc(c.name) + '</h3><span>' + esc(c.blurb) + '</span></div></button>'
    ).join("");

    const chips = $("#filters");
    chips.innerHTML = '<button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>' +
      COLLECTIONS.map((c) => '<button class="chip" type="button" data-filter="' + c.id + '" aria-pressed="false">' + esc(c.name) + '</button>').join("");

    function apply(cat, scroll) {
      active = cat;
      $$("[data-filter]", chips).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
      $$("[data-collection]", colWrap).forEach((b) => { b.classList.toggle("is-active", b.dataset.collection === cat); b.setAttribute("aria-pressed", String(b.dataset.collection === cat)); });
      const list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
      fillGrid(featured, list, (p) => (p.newArrival ? "New" : p.bestseller ? "Best Seller" : ""));
      if (titleNote) titleNote.textContent = list.length + (list.length === 1 ? " timepiece" : " timepieces");
      if (scroll) $("#featured").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    chips.addEventListener("click", (e) => { const b = e.target.closest("[data-filter]"); if (b) apply(b.dataset.filter, false); });
    colWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-collection]");
      if (b) apply(active === b.dataset.collection ? "all" : b.dataset.collection, true);
    });

    const fromUrl = new URLSearchParams(location.search).get("collection");
    apply(COLLECTIONS.some((c) => c.id === fromUrl) ? fromUrl : "all", false);

    // best sellers / new arrivals tabs
    const bsGrid = $("#bestsellers-grid");
    const tabs = $("#bs-tabs");
    function bsRender(kind) {
      $$("[data-bs]", tabs).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bs === kind)));
      const list = PRODUCTS.filter((p) => (kind === "best" ? p.bestseller : p.newArrival)).slice(0, 4);
      fillGrid(bsGrid, list, () => (kind === "best" ? "Best Seller" : "New"));
    }
    tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-bs]"); if (b) bsRender(b.dataset.bs); });
    bsRender("best");
  }

  /* ---------- newsletter ---------- */
  function initNewsletter() {
    const form = $("#newsletter-form");
    if (!form) return;
    const input = $("input", form);
    const msg = $("#newsletter-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      msg.classList.remove("is-error");
      if (!v) { msg.textContent = "Please enter your email address."; msg.classList.add("is-error"); input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      if (!EMAIL_RE.test(v)) { msg.textContent = "That email doesn't look right. Please check and try again."; msg.classList.add("is-error"); input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      input.removeAttribute("aria-invalid");
      msg.textContent = "Thank you. You're on the list.";
      form.reset();
    });
    input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
  }

  /* ---------- product details ---------- */
  function initProductDetails() {
    const root = $("#pd-root");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = getProduct(id);
    if (!p) {
      root.innerHTML = '<div class="empty"><h2>Watch not found</h2><p>We couldn\'t find that timepiece. It may have moved.</p><a class="btn" href="index.html#shop">Browse the collection</a></div>';
      document.title = "Not found – Aureum";
      return;
    }
    document.title = p.name + " – Aureum Horologie";
    const cat = COLLECTIONS.find((c) => c.id === p.category);
    let colour = p.colours[0].name;
    let qty = 1;

    root.innerHTML =
      '<div class="container"><p class="breadcrumb" style="padding-top:36px"><a href="index.html">Home</a> / <a href="index.html?collection=' + p.category + '#shop">' + esc(cat ? cat.name : p.category) + '</a> / ' + esc(p.name) + '</p>' +
      '<div class="pd" style="padding-top:20px"><div class="gallery">' +
      '<div class="gallery__thumbs">' + p.gallery.map((src, i) => '<button class="gallery__thumb" type="button" data-img="' + src + '" aria-label="View image ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + src + '" alt="" loading="lazy"></button>').join("") + '</div>' +
      '<div class="gallery__main" id="gallery-main" title="Click to zoom"><img id="gallery-img" src="' + p.gallery[0] + '" alt="' + esc(p.name) + ' watch"></div></div>' +
      '<div class="pd__info"><span class="eyebrow">' + esc(cat ? cat.name : p.category) + ' collection</span>' +
      '<h1>' + esc(p.name) + '</h1><span class="pd__price">' + formatPrice(p.price) + '</span>' +
      '<p>' + esc(p.description) + '</p>' +
      '<span class="field-label" id="colour-label">Strap colour: <b id="colour-name" style="font-weight:400;color:#fff">' + esc(colour) + '</b></span>' +
      '<div class="swatches" role="radiogroup" aria-labelledby="colour-label">' + p.colours.map((c, i) => '<button class="swatch" type="button" role="radio" aria-checked="' + (i === 0) + '" data-colour="' + esc(c.name) + '"><i style="background:' + c.hex + '"></i>' + esc(c.name) + '</button>').join("") + '</div>' +
      '<span class="field-label">Quantity</span>' +
      '<div class="qty"><button type="button" data-q="-1" aria-label="Decrease quantity">&minus;</button><output id="qty-out" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>' +
      '<div class="pd__buy"><button class="btn btn--solid" type="button" id="pd-add">Add to Cart</button><button class="btn" type="button" id="pd-buy">Buy Now</button></div>' +
      '<span class="field-label" style="margin-top:44px">Specifications</span>' +
      '<dl class="specs">' + Object.keys(p.specs).map((k) => '<div><dt>' + esc(k) + '</dt><dd>' + esc(p.specs[k]) + '</dd></div>').join("") + '</dl>' +
      '</div></div></div>';

    // gallery
    const main = $("#gallery-main");
    const img = $("#gallery-img");
    $$(".gallery__thumb", root).forEach((b) => b.addEventListener("click", () => {
      img.src = b.dataset.img;
      $$(".gallery__thumb", root).forEach((t) => t.removeAttribute("aria-current"));
      b.setAttribute("aria-current", "true");
    }));
    main.addEventListener("click", () => main.classList.toggle("is-zoomed"));
    main.addEventListener("mousemove", (e) => {
      const r = main.getBoundingClientRect();
      main.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%");
      main.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
    main.addEventListener("mouseleave", () => main.classList.remove("is-zoomed"));

    // options
    $$(".swatch", root).forEach((s) => s.addEventListener("click", () => {
      colour = s.dataset.colour;
      $$(".swatch", root).forEach((o) => o.setAttribute("aria-checked", String(o === s)));
      $("#colour-name").textContent = colour;
    }));
    $$("[data-q]", root).forEach((b) => b.addEventListener("click", () => {
      qty = Math.max(1, Math.min(10, qty + parseInt(b.dataset.q, 10)));
      $("#qty-out").textContent = qty;
    }));
    $("#pd-add").addEventListener("click", () => { Cart.add(p.id, qty, colour); toast(qty + " × " + p.name + " added to your cart"); });
    $("#pd-buy").addEventListener("click", () => { Cart.add(p.id, qty, colour); location.href = "checkout.html"; });

    // related
    const rel = $("#related-grid");
    if (rel) {
      let list = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
      PRODUCTS.forEach((x) => { if (x.id !== p.id && list.length < 4 && !list.includes(x)) list.push(x); });
      fillGrid(rel, list.slice(0, 4));
    }
  }

  /* ---------- cart page ---------- */
  function initCartPage() {
    const root = $("#cart-root");
    if (!root) return;

    function render() {
      const items = Cart.detailed();
      if (!items.length) {
        root.innerHTML = '<div class="empty container"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
          '<h2>Your cart is empty</h2><p>Time is on your side. Find a watch worth waiting for.</p><a class="btn" href="index.html#shop">Explore the collection</a></div>';
        return;
      }
      const ship = Cart.shipping();
      root.innerHTML = '<div class="container"><div class="cart-layout"><section aria-label="Items in your cart">' +
        items.map((i) =>
          '<article class="cart-item"><a href="product-details.html?id=' + i.product.id + '"><img src="' + i.product.image + '" alt="' + esc(i.product.name) + '"></a>' +
          '<div><h3><a href="product-details.html?id=' + i.product.id + '">' + esc(i.product.name) + '</a></h3><small>Strap: ' + esc(i.colour) + ' · ' + formatPrice(i.product.price) + ' each</small>' +
          '<div class="qty"><button type="button" data-act="dec" data-key="' + esc(i.key) + '" aria-label="Decrease quantity of ' + esc(i.product.name) + '">&minus;</button><output>' + i.qty + '</output><button type="button" data-act="inc" data-key="' + esc(i.key) + '" aria-label="Increase quantity of ' + esc(i.product.name) + '">+</button></div></div>' +
          '<div class="cart-item__side"><span class="price">' + formatPrice(i.lineTotal) + '</span><button class="remove-btn" type="button" data-act="rm" data-key="' + esc(i.key) + '">Remove</button></div></article>'
        ).join("") + '</section>' +
        '<aside class="summary" aria-label="Order summary"><h2>Order Summary</h2><dl>' +
        '<div><dt>Subtotal</dt><dd>' + formatPrice(Cart.subtotal()) + '</dd></div>' +
        '<div><dt>Shipping</dt><dd>' + (ship ? formatPrice(ship) : "Complimentary") + '</dd></div>' +
        '<div class="total"><dt>Total</dt><dd>' + formatPrice(Cart.total()) + '</dd></div></dl>' +
        '<a class="btn btn--solid btn--block" href="checkout.html">Proceed to Checkout</a>' +
        '<p class="summary__note">' + (ship ? "Free insured shipping on orders over " + formatPrice(Cart.FREE_SHIPPING_OVER) + "." : "Your order qualifies for free insured shipping.") + '</p></aside></div></div>';
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const key = b.dataset.key;
      const item = Cart.detailed().find((i) => i.key === key);
      if (!item) return;
      if (b.dataset.act === "inc") Cart.setQty(key, item.qty + 1);
      else if (b.dataset.act === "dec") Cart.setQty(key, item.qty - 1);
      else if (b.dataset.act === "rm") { Cart.remove(key); toast(item.product.name + " removed"); }
    });
    document.addEventListener("cart:changed", render);
    render();
  }

  /* ---------- form helpers ---------- */
  function setError(input, message) {
    const err = input.closest(".field").querySelector(".err");
    if (message) { input.setAttribute("aria-invalid", "true"); if (err) err.textContent = message; }
    else { input.removeAttribute("aria-invalid"); if (err) err.textContent = ""; }
    return !message;
  }
  function bindClear(form) {
    $$("input, select", form).forEach((i) => i.addEventListener("input", () => setError(i, "")));
  }

  /* ---------- account page ---------- */
  function initAccount() {
    const login = $("#login-form");
    const register = $("#register-form");
    if (!login || !register) return;

    $$("[data-toggle-pw]").forEach((btn) => {
      btn.innerHTML = ICONS.eye;
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.togglePw);
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
        btn.setAttribute("aria-pressed", String(show));
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });

    bindClear(login); bindClear(register);

    login.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#login-email"), pw = $("#login-password"), msg = $("#login-msg");
      let ok = true;
      ok = setError(email, !email.value.trim() ? "Email is required." : !EMAIL_RE.test(email.value.trim()) ? "Enter a valid email address." : "") && ok;
      ok = setError(pw, !pw.value ? "Password is required." : pw.value.length < 8 ? "Password must be at least 8 characters." : "") && ok;
      msg.classList.toggle("is-error", !ok);
      msg.textContent = ok ? "Welcome back. (Demo: no real sign-in takes place.)" : "Please correct the highlighted fields.";
      if (ok) login.reset();
    });

    register.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#reg-name"), email = $("#reg-email"), pw = $("#reg-password"), pw2 = $("#reg-confirm"), terms = $("#reg-terms"), msg = $("#register-msg");
      let ok = true;
      ok = setError(name, name.value.trim().length < 2 ? "Please enter your full name." : "") && ok;
      ok = setError(email, !EMAIL_RE.test(email.value.trim()) ? "Enter a valid email address." : "") && ok;
      const strong = pw.value.length >= 8 && /[A-Za-z]/.test(pw.value) && /\d/.test(pw.value);
      ok = setError(pw, !strong ? "Use 8+ characters with letters and a number." : "") && ok;
      ok = setError(pw2, pw2.value !== pw.value || !pw2.value ? "Passwords do not match." : "") && ok;
      const termsOk = terms.checked;
      if (!termsOk) ok = false;
      msg.classList.toggle("is-error", !ok);
      msg.textContent = !ok ? (termsOk ? "Please correct the highlighted fields." : "Please accept the terms to continue.") : "Account created for " + name.value.trim() + ". (Demo: nothing is stored.)";
      if (ok) register.reset();
    });
  }

  /* ---------- checkout ---------- */
  function initCheckout() {
    const root = $("#checkout-root");
    if (!root) return;
    const formWrap = $("#checkout-content");
    const confirmWrap = $("#confirm-content");
    const form = $("#checkout-form");
    let placed = false;

    function renderSummary() {
      const items = Cart.detailed();
      $("#mini-items").innerHTML = items.map((i) =>
        '<div class="mini-line"><img src="' + i.product.image + '" alt=""><div>' + esc(i.product.name) + '<small>' + esc(i.colour) + ' · Qty ' + i.qty + '</small></div><span>' + formatPrice(i.lineTotal) + '</span></div>'
      ).join("");
      const ship = Cart.shipping();
      $("#co-sub").textContent = formatPrice(Cart.subtotal());
      $("#co-ship").textContent = ship ? formatPrice(ship) : "Complimentary";
      $("#co-total").textContent = formatPrice(Cart.total());
    }

    function showEmpty() {
      formWrap.innerHTML = '<div class="empty container"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><h2>Nothing to check out</h2><p>Add a watch to your cart first.</p><a class="btn" href="index.html#shop">Explore the collection</a></div>';
    }

    if (!Cart.count()) { showEmpty(); return; }
    renderSummary();
    document.addEventListener("cart:changed", () => { if (!placed && Cart.count()) renderSummary(); });

    // payment method switch
    const cardFields = $("#card-fields");
    $$('input[name="payment"]', form).forEach((r) => r.addEventListener("change", () => {
      const isCard = $('input[name="payment"]:checked', form).value === "card";
      cardFields.hidden = !isCard;
    }));
    bindClear(form);

    // light input formatting
    $("#card-number").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 19);
      e.target.value = d.replace(/(.{4})/g, "$1 ").trim();
    });
    $("#card-expiry").addEventListener("input", (e) => {
      let d = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (d.length > 2) d = d.slice(0, 2) + "/" + d.slice(2);
      e.target.value = d;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const req = (id, label) => { const i = $("#" + id); ok = setError(i, i.value.trim() ? "" : label + " is required.") && ok; return i; };
      req("co-first", "First name"); req("co-last", "Last name");
      const email = $("#co-email");
      ok = setError(email, !EMAIL_RE.test(email.value.trim()) ? "Enter a valid email address." : "") && ok;
      const phone = $("#co-phone");
      ok = setError(phone, phone.value.replace(/\D/g, "").length < 7 ? "Enter a valid phone number." : "") && ok;
      req("co-address", "Address"); req("co-city", "City"); req("co-state", "State / region");
      const zip = $("#co-zip");
      ok = setError(zip, zip.value.trim().length < 3 ? "Enter a valid postal code." : "") && ok;
      req("co-country", "Country");

      if ($('input[name="payment"]:checked', form).value === "card") {
        const num = $("#card-number"), exp = $("#card-expiry"), cvv = $("#card-cvv"), holder = $("#card-name");
        ok = setError(holder, holder.value.trim().length < 2 ? "Enter the name on the card." : "") && ok;
        const digits = num.value.replace(/\D/g, "");
        ok = setError(num, digits.length < 13 ? "Enter a valid card number." : "") && ok;
        let expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp.value);
        if (expOk) {
          const now = new Date();
          const yy = parseInt(exp.value.slice(3), 10), mm = parseInt(exp.value.slice(0, 2), 10);
          const curYY = now.getFullYear() % 100;
          expOk = yy > curYY || (yy === curYY && mm >= now.getMonth() + 1);
        }
        ok = setError(exp, expOk ? "" : "Use a valid future date (MM/YY).") && ok;
        ok = setError(cvv, /^\d{3,4}$/.test(cvv.value) ? "" : "3 or 4 digits.") && ok;
      }

      const msg = $("#checkout-msg");
      if (!ok) {
        msg.textContent = "Please correct the highlighted fields.";
        msg.classList.add("is-error");
        const firstBad = $('[aria-invalid="true"]', form);
        if (firstBad) firstBad.focus();
        return;
      }
      msg.textContent = "";

      // place order (frontend demonstration only)
      placed = true;
      const orderId = "AUR-" + Date.now().toString().slice(-7);
      const firstName = $("#co-first").value.trim();
      const emailVal = email.value.trim();
      const totalPaid = Cart.total();
      Cart.clear();
      formWrap.hidden = true;
      confirmWrap.hidden = false;
      $("#confirm-name").textContent = firstName;
      $("#confirm-email").textContent = emailVal;
      $("#confirm-total").textContent = formatPrice(totalPaid);
      $("#confirm-id").textContent = "Order " + orderId;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- init ---------- */
  document.documentElement.classList.remove("no-js");
  renderChrome();
  initNav();
  initSearch();
  Cart.updateBadge();
  initHome();
  initNewsletter();
  initProductDetails();
  initCartPage();
  initAccount();
  initCheckout();
  initReveal();
  window.addEventListener("storage", Cart.updateBadge);
  window.addEventListener("pageshow", Cart.updateBadge);
})();
