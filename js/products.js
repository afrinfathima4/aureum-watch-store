/* AUREUM – product catalogue.
   Images live in /images. Replace any file there with real photography and keep the same name. */

const COLLECTIONS = [
  { id: "classic", name: "Classic", blurb: "Roman numerals, warm gold cases", image: "images/image (20).png" },
  { id: "minimalist", name: "Minimalist", blurb: "Pure dials, quiet confidence", image: "images/image (23).png" },
  { id: "chronograph", name: "Chronograph", blurb: "Precision in motion", image: "images/image (26).png" },
  { id: "premium", name: "Premium", blurb: "Our haute horlogerie pieces", image: "images/image (29).png" },
  { id: "modern", name: "Modern", blurb: "Bold lines for today", image: "images/image (32).png" }
];

const PRODUCTS = [
  {
    id: "aureum-classique", name: "Aureum Classique", category: "classic", price: 2450,
    short: "A dress watch with a cream dial and roman numerals.",
    description: "The Classique is the house signature: a champagne-cream dial, hand-finished roman numerals and a warm rose-gold case on a hand-stitched espresso leather strap. Understated enough for every day, refined enough for every occasion.",
    image: "images/image (20).png", gallery: ["images/image (20).png", "images/image (21).png", "images/image (22).png"],
    colours: [{ name: "Espresso", hex: "#3A2923" }, { name: "Mocha", hex: "#63483D" }, { name: "Crème", hex: "#B99A84" }],
    specs: { Movement: "Automatic, 38h reserve", Case: "40 mm rose-gold steel", Glass: "Sapphire crystal", Strap: "Italian calf leather", "Water resistance": "50 m" },
    bestseller: true, newArrival: false
  },
  {
    id: "nocturne-minimale", name: "Nocturne Minimale", category: "minimalist", price: 1980,
    short: "Midnight dial, four indices, nothing more.",
    description: "Nocturne strips the watch down to its essence. A deep black dial, four slender indices and a satin beige case let the time speak for itself. The mocha strap adds warmth against the dark.",
    image: "images/image (23).png", gallery: ["images/image (23).png", "images/image (24).png", "images/image (25).png"],
    colours: [{ name: "Mocha", hex: "#63483D" }, { name: "Espresso", hex: "#3A2923" }, { name: "Onyx", hex: "#171514" }],
    specs: { Movement: "Swiss quartz", Case: "38 mm brushed steel", Glass: "Sapphire crystal", Strap: "Vegetable-tanned leather", "Water resistance": "50 m" },
    bestseller: true, newArrival: true
  },
  {
    id: "meridian-chronograph", name: "Meridian Chronograph", category: "chronograph", price: 3290,
    short: "Three-register chronograph with an espresso dial.",
    description: "Built for precision, the Meridian pairs a deep espresso dial with three crisp sub-registers and a polished steel case. A tachymeter-ready bezel and a black leather strap complete the look.",
    image: "images/image (26).png", gallery: ["images/image (26).png", "images/image (27).png", "images/image (28).png"],
    colours: [{ name: "Onyx", hex: "#171514" }, { name: "Espresso", hex: "#3A2923" }],
    specs: { Movement: "Automatic chronograph", Case: "42 mm polished steel", Glass: "Domed sapphire", Strap: "Black calf leather", "Water resistance": "100 m" },
    bestseller: true, newArrival: false
  },
  {
    id: "sovereign-tourbillon", name: "Sovereign Tourbillon", category: "premium", price: 8900,
    short: "Our haute horlogerie flagship in gold.",
    description: "The Sovereign is the pinnacle of the collection. A gold-toned case frames a black dial with a signature small seconds window, powered by a hand-wound calibre assembled by a single watchmaker.",
    image: "images/image (29).png", gallery: ["images/image (29).png", "images/image (30).png", "images/image (31).png"],
    colours: [{ name: "Espresso", hex: "#3A2923" }, { name: "Mocha", hex: "#63483D" }],
    specs: { Movement: "Hand-wound, 72h reserve", Case: "41 mm 18k rose gold", Glass: "Sapphire, anti-reflective", Strap: "Alligator-embossed leather", "Water resistance": "30 m" },
    bestseller: false, newArrival: true
  },
  {
    id: "vertex-modern", name: "Vertex Modern", category: "modern", price: 2150,
    short: "A mocha dial in a dark, architectural case.",
    description: "Vertex is a contemporary statement: a matte mocha dial with bold baton indices inside a blackened steel case. Designed to be worn hard and to look sharp doing it.",
    image: "images/image (32).png", gallery: ["images/image (32).png", "images/image (33).png", "images/image (34).png"],
    colours: [{ name: "Espresso", hex: "#3A2923" }, { name: "Onyx", hex: "#171514" }],
    specs: { Movement: "Automatic, 42h reserve", Case: "41 mm PVD steel", Glass: "Sapphire crystal", Strap: "Matte leather", "Water resistance": "100 m" },
    bestseller: false, newArrival: true
  },
  {
    id: "elysian-moonphase", name: "Elysian Moonphase", category: "classic", price: 4750,
    short: "A warm beige dial with a small seconds register.",
    description: "Elysian celebrates the quiet romance of watchmaking. A sandy crème-brûlée dial, roman numerals and a delicate small seconds sub-dial sit under a gently domed crystal.",
    image: "images/image (35).png", gallery: ["images/image (35).png", "images/image (36).png", "images/image (37).png"],
    colours: [{ name: "Mocha", hex: "#63483D" }, { name: "Espresso", hex: "#3A2923" }, { name: "Crème", hex: "#B99A84" }],
    specs: { Movement: "Automatic, 48h reserve", Case: "39 mm rose-gold steel", Glass: "Domed sapphire", Strap: "Suede-lined leather", "Water resistance": "50 m" },
    bestseller: true, newArrival: false
  },
  {
    id: "onyx-regatta", name: "Onyx Regatta", category: "chronograph", price: 3650,
    short: "Blackout chronograph with warm beige accents.",
    description: "Onyx Regatta is the dark side of the chronograph. A black dial, beige-gold accents and three tight sub-registers make a watch that is as readable as it is dramatic.",
    image: "images/image (38).png", gallery: ["images/image (38).png", "images/image (39).png", "images/image (40).png"],
    colours: [{ name: "Onyx", hex: "#171514" }, { name: "Mocha", hex: "#63483D" }],
    specs: { Movement: "Automatic chronograph", Case: "43 mm steel", Glass: "Sapphire crystal", Strap: "Black rubber-lined leather", "Water resistance": "150 m" },
    bestseller: false, newArrival: true
  },
  {
    id: "lumen-slim", name: "Lumen Slim", category: "minimalist", price: 1650,
    short: "An ultra-slim, numeral-free cream dial.",
    description: "Lumen Slim is just 6 mm thick. With no numerals and a cream dial, it slips under a cuff and disappears, until you glance down and the light catches it.",
    image: "images/image (41).png", gallery: ["images/image (41).png", "images/image (42).png", "images/image (43).png"],
    colours: [{ name: "Mocha", hex: "#63483D" }, { name: "Espresso", hex: "#3A2923" }],
    specs: { Movement: "Ultra-thin quartz", Case: "36 mm, 6 mm thick", Glass: "Sapphire crystal", Strap: "Soft calf leather", "Water resistance": "30 m" },
    bestseller: true, newArrival: false
  }
];

function getProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function formatPrice(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
