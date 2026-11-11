/* AUREUM – cart logic (localStorage). Depends on products.js. */

const Cart = (function () {
  const KEY = "aureum_cart_v1";
  const FREE_SHIPPING_OVER = 2500;
  const SHIPPING_FLAT = 45;

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
    updateBadge();
    document.dispatchEvent(new CustomEvent("cart:changed"));
  }

  function lineKey(item) { return item.id + "|" + (item.colour || ""); }

  function add(id, qty, colour) {
    const product = getProduct(id);
    if (!product) return;
    qty = Math.max(1, parseInt(qty, 10) || 1);
    colour = colour || (product.colours[0] && product.colours[0].name) || "";
    const items = read();
    const found = items.find(function (i) { return i.id === id && i.colour === colour; });
    if (found) { found.qty = Math.min(10, found.qty + qty); }
    else { items.push({ id: id, qty: Math.min(10, qty), colour: colour }); }
    write(items);
  }

  function setQty(key, qty) {
    const items = read();
    const item = items.find(function (i) { return lineKey(i) === key; });
    if (!item) return;
    item.qty = Math.max(1, Math.min(10, qty));
    write(items);
  }

  function remove(key) {
    write(read().filter(function (i) { return lineKey(i) !== key; }));
  }

  function clear() { write([]); }

  function detailed() {
    return read().map(function (i) {
      const p = getProduct(i.id);
      return p ? Object.assign({}, i, { product: p, key: lineKey(i), lineTotal: p.price * i.qty }) : null;
    }).filter(Boolean);
  }

  function count() { return read().reduce(function (n, i) { return n + i.qty; }, 0); }

  function subtotal() { return detailed().reduce(function (s, i) { return s + i.lineTotal; }, 0); }

  function shipping() {
    const s = subtotal();
    return s === 0 || s >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  }

  function total() { return subtotal() + shipping(); }

  function updateBadge() {
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  return {
    add: add, setQty: setQty, remove: remove, clear: clear, detailed: detailed,
    count: count, subtotal: subtotal, shipping: shipping, total: total, updateBadge: updateBadge,
    FREE_SHIPPING_OVER: FREE_SHIPPING_OVER
  };
})();
