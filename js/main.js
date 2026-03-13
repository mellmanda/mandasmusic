// Product data
const products = [
  {
    id: 1,
    name: "Vintage Stratocaster",
    price: 8990,
    image: "images/product-1.jpg",
    category: "Guitars",
    description:
      "A timeless electric guitar with bright, expressive tone. Perfect for blues, rock, and indie players.",
    specs: [
      "Body: Alder",
      "Neck: Maple, C-shape",
      "Pickups: 3x single-coil",
      "Bridge: Vintage tremolo",
      "Finish: 3-tone sunburst",
    ],
  },
  {
    id: 2,
    name: "Jazz Bass Deluxe",
    price: 7990,
    image: "images/product-2.jpg",
    category: "Guitars",
    description:
      "A punchy, deep-sounding bass with smooth playability. Ideal for funk, jazz, and studio recording.",
    specs: [
      "Body: Ash",
      "Neck: Maple",
      "Pickups: Dual single-coil",
      "Controls: Volume, tone, blend",
      "Finish: Gloss black",
    ],
  },
  {
    id: 3,
    name: "Mandas Acoustic Pro",
    price: 6490,
    image: "images/product-3.jpg",
    category: "Guitars",
    description:
      "A warm, resonant acoustic guitar with excellent projection. Great for singer-songwriters and live performers.",
    specs: [
      "Top: Solid spruce",
      "Back & sides: Mahogany",
      "Neck: Rosewood",
      'Scale: 25.5"',
      "Finish: Natural satin",
    ],
  },
  {
    id: 4,
    name: "Studio Headphones",
    price: 1490,
    image: "images/product-4.jpg",
    category: "Studio",
    description:
      "Flat-response studio headphones designed for accurate mixing and monitoring.",
    specs: [
      "Frequency response: 10Hz–28kHz",
      "Impedance: 32Ω",
      "Cable: Detachable 3m",
      "Weight: 240g",
    ],
  },
  {
    id: 5,
    name: "Tube Amp 30W",
    price: 5990,
    image: "images/product-5.jpg",
    category: "Amps",
    description:
      "A powerful 30-watt tube amplifier with rich harmonics and natural overdrive.",
    specs: [
      "Power: 30W",
      "Tubes: 2x EL84, 3x 12AX7",
      "Channels: Clean / Overdrive",
      'Speaker: 12" custom',
      "Finish: Vintage tweed",
    ],
  },
  {
    id: 6,
    name: "Guitar Pedal Board",
    price: 1290,
    image: "images/product-6.jpg",
    category: "Accessories",
    description:
      "A lightweight pedalboard with built-in power supply and cable routing.",
    specs: [
      "Material: Aluminum",
      "Power: 8 isolated outputs",
      "Weight: 1.8kg",
      "Includes: Soft case",
    ],
  },
  {
    id: 7,
    name: "Stage Microphone",
    price: 990,
    image: "images/product-7.jpg",
    category: "Accessories",
    description:
      "A durable cardioid microphone perfect for live vocals and speeches.",
    specs: [
      "Pattern: Cardioid",
      "Frequency: 50Hz–15kHz",
      "Connector: XLR",
      "Includes: Clip + pouch",
    ],
  },
  {
    id: 8,
    name: "MIDI Keyboard 49",
    price: 1990,
    image: "images/product-8.jpg",
    category: "Studio",
    description:
      "A compact MIDI controller with velocity-sensitive keys and DAW integration.",
    specs: [
      "Keys: 49",
      "Pads: 8 RGB",
      "Knobs: 9 assignable",
      "Connectivity: USB-MIDI",
      "Includes: Software bundle",
    ],
  },
];

const CART_KEY = "mandasMusicCart";

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function showToast() {
  const toast = document.getElementById("cart-toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  }
  saveCart(cart);
  updateCartCount();
  showToast();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector("[data-cart-count]");
  if (badge) {
    badge.textContent = count;
  }
}

// PRODUCTS PAGE
function renderProductGrid(list = products) {
  const container = document.querySelector("[data-product-grid]");
  if (!container) return;

  container.innerHTML = "";
  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-image-link">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/product-fallback.jpg'">
      </a>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">${product.price}kr</p>
        <button class="btn" data-add-to-cart="${product.id}">Add to cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    const id = Number(button.getAttribute("data-add-to-cart"));
    addToCart(id);
  });
}

function filterProducts(category) {
  if (category === "All") {
    renderProductGrid(products);
  } else {
    const filtered = products.filter((p) => p.category === category);
    renderProductGrid(filtered);
  }
}

// PRODUCT PAGE
function renderSingleProduct() {
  const detailContainer = document.querySelector("[data-product-detail]");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const product = products.find((p) => p.id === id) || products[0];

  detailContainer.innerHTML = `
    <div class="product-detail-grid">
      <picture>
        <source media="(max-width: 600px)" srcset="${product.image}">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/product-fallback.jpg'">
      </picture>
      <div class="product-detail-info">
        <h1>${product.name}</h1>
        <p class="product-detail-price">${product.price}kr</p>
        <p>${product.description}</p>
        <ul>
          ${product.specs.map((s) => `<li>${s}</li>`).join("")}
        </ul>
        <button class="btn" id="add-to-cart-detail">Add to cart</button>
      </div>
    </div>
    <h2>You may also like</h2>
    <div class="product-grid" id="related"></div>
  `;

  const btn = document.getElementById("add-to-cart-detail");
  btn.addEventListener("click", () => addToCart(product.id));

  renderRelatedProducts(product.id);
}

function renderRelatedProducts(currentId) {
  const relatedContainer = document.getElementById("related");
  if (!relatedContainer) return;

  const related = products.filter((p) => p.id !== currentId).slice(0, 3);
  related.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/product-fallback.jpg'">
      </a>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-price">${product.price}kr</p>
      </div>
    `;
    relatedContainer.appendChild(card);
  });
}

// CART PAGE
function renderCart() {
  const tableBody = document.querySelector("[data-cart-items]");
  const totalEl = document.querySelector("[data-cart-total]");
  if (!tableBody || !totalEl) return;

  const cart = getCart();
  tableBody.innerHTML = "";

  if (cart.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
    totalEl.textContent = "0kr";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    row.innerHTML = `
  <td class="cart-product">
    <img src="${item.image}" alt="${item.name}">
    <span>${item.name}</span>
  </td>
  <td class="cart-qty">
  <button class="qty-btn" data-qty-minus="${item.id}">−</button>
  <span>${item.quantity}</span>
  <button class="qty-btn" data-qty-plus="${item.id}">+</button>
</td>
  <td>${item.price} kr</td>
  <td>${itemTotal} kr</td>
  <td>
    <button class="btn btn-small" data-remove="${item.id}">Remove</button>
  </td>
`;
    tableBody.appendChild(row);
  });

  totalEl.textContent = `${total}kr`;

  tableBody.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-qty-plus]");
    const minus = event.target.closest("[data-qty-minus]");
    const remove = event.target.closest("[data-remove]");

    if (plus) {
      const id = Number(plus.dataset.qtyPlus);
      increaseQty(id);
      renderCart();
      return;
    }

    if (minus) {
      const id = Number(minus.dataset.qtyMinus);
      decreaseQty(id);
      renderCart();
      return;
    }

    if (remove) {
      const id = Number(remove.dataset.remove);
      removeFromCart(id);
      renderCart();
    }
  });
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += 1;
  saveCart(cart);
  updateCartCount();
}

function decreaseQty(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    // remove item completely
    const newCart = cart.filter((i) => i.id !== productId);
    saveCart(newCart);
  } else {
    saveCart(cart);
  }

  updateCartCount();
}

// Search
function initSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term),
    );
    renderProductGrid(filtered);
  });
}

// Filters
function initFilters() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    const category = btn.dataset.filter;
    filterProducts(category);
  });
}

// Mobile menu
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navList = document.querySelector("nav ul");

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProductGrid();
  renderSingleProduct();
  renderCart();
  initSearch();
  initFilters();
  initDarkMode();
  initMobileMenu();
});

/* Some styling ideas were generated with chatGPT (AI). */
/* code assistance from Chatgpt, P5.js (AI). */
