// =====================================================
// 📁 PIPASTORE - APP PUBLIC FINAL (ORGANIZADO)
// =====================================================



// =====================================================
// 📦 STORAGE GLOBAL
// =====================================================

let products = JSON.parse(localStorage.getItem("products")) || [];
let faqs = JSON.parse(localStorage.getItem("faqs")) || [];
let coupons = JSON.parse(localStorage.getItem("coupons")) || [];
let settings = JSON.parse(localStorage.getItem("settings")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];



// =====================================================
// 🔄 SINCRONIZAÇÃO GLOBAL (ÚNICA FONTE DE VERDADE)
// =====================================================

function syncAll() {
    products = JSON.parse(localStorage.getItem("products")) || [];
    faqs = JSON.parse(localStorage.getItem("faqs")) || [];
    coupons = JSON.parse(localStorage.getItem("coupons")) || [];
    settings = JSON.parse(localStorage.getItem("settings")) || {};
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    renderProducts();
    renderFAQ();
    renderSiteFAQ();
    loadSocials();
    updateCart();
    loadBanner();
}



// =====================================================
// 🔄 SINCRONIZAÇÃO DO CARRINHO
// =====================================================

function syncCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
}



// =====================================================
// 🔄 SINCRONIZAÇÃO DE PRODUTOS (LEGADO COMPATÍVEL)
// =====================================================

function syncProducts() {
    products = JSON.parse(localStorage.getItem("products")) || [];
    renderProducts();
}



// =====================================================
// 🛒 RENDERIZA PRODUTOS
// =====================================================

function renderProducts(list = products) {

    const grid = document.getElementById("productGrid");
    const promoGrid = document.getElementById("promoProducts");
    const stockGrid = document.getElementById("stockProducts");

    if (grid) grid.innerHTML = "";
    if (promoGrid) promoGrid.innerHTML = "";
    if (stockGrid) stockGrid.innerHTML = "";



    // =====================================================
    // 🧱 CRIA CARD
    // =====================================================

    function createCard(product) {

        let badge = "";

        if (product.stock <= 0) {
            badge = `<span class="out-badge">❌ ESGOTADO</span>`;
        } else if (product.stock <= 3) {
            badge = `<span class="low-badge">⚠️ ÚLTIMAS UNIDADES</span>`;
        } else if (product.promo) {
            badge = `<span class="promo-badge">🔥 PROMOÇÃO</span>`;
        }



        const price = product.promo
            ? `
            <div class="price-box">
                <span class="old-price">R$ ${product.price}</span>
                <strong class="promo-price">R$ ${product.promo}</strong>
            </div>
        `
            : `
            <div class="price-box">
                <strong>R$ ${product.price}</strong>
            </div>
        `;



        return `
        <div class="product-card">

            <div class="badge">${badge}</div>

            <img src="${product.image}" alt="${product.name}">

            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${price}
            </div>

            <button onclick="addCart(${product.id})">
                Comprar
            </button>

        </div>
        `;
    }



    // GRID PRINCIPAL
    list.forEach(p => {
        if (grid) grid.innerHTML += createCard(p);
    });



    // PROMOÇÕES
    products.filter(p => p.promo).forEach(p => {
        if (promoGrid) promoGrid.innerHTML += createCard(p);
    });



    // ESTOQUE BAIXO
    products.filter(p => p.stock <= 3).forEach(p => {
        if (stockGrid) stockGrid.innerHTML += createCard(p);
    });
}



// =====================================================
// 🔎 FILTRO
// =====================================================

function filter(category) {
    if (category === "Todos") return renderProducts();

    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
}



// =====================================================
// 🔍 BUSCA
// =====================================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", e => {

        const value = e.target.value.toLowerCase();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value)
        );

        renderProducts(filtered);
    });
}



// =====================================================
// ❓ FAQ (SITE)
// =====================================================

function renderFAQ() {

    const container = document.getElementById("faqContainer");
    if (!container) return;

    container.innerHTML = "";

    faqs.forEach(faq => {

        container.innerHTML += `
        <details>
            <summary>${faq.question}</summary>
            <p>${faq.answer}</p>
        </details>
        `;
    });
}



// =====================================================
// ❓ FAQ (ESTILO ALTERNATIVO)
// =====================================================

function renderSiteFAQ() {

    const container = document.getElementById("faqContainer");
    if (!container) return;

    container.innerHTML = "";

    faqs.forEach(faq => {

        container.innerHTML += `
        <div class="faq-item">
            <button class="faq-question">${faq.question}</button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
        `;
    });

    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.onclick = () => {
            btn.nextElementSibling.classList.toggle("active");
        };
    });
}



// =====================================================
// 🌐 REDES SOCIAIS
// =====================================================

function loadSocials() {

    const whatsapp = document.getElementById("whatsappLink");
    const instagram = document.getElementById("instagramLink");

    if (whatsapp) {
        whatsapp.href = `https://wa.me/${settings.whatsapp || ""}`;
    }

    if (instagram) {
        instagram.href = settings.instagram || "#";
    }
}



// =====================================================
// 🛒 CARRINHO
// =====================================================

function addCart(id) {

    syncCart();

    const product = products.find(p => p.id === id);
    if (!product) return;

    if (product.stock <= 0) {
        alert("Produto esgotado");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    alert("Produto adicionado!");
}



// =====================================================
// 🔢 CARRINHO COUNT
// =====================================================

function updateCart() {

    const el = document.getElementById("cartCount");

    if (el) {
        syncCart();
        el.innerText = cart.length;
    }
}



// =====================================================
// 🖼️ BANNER
// =====================================================

function loadBanner() {

    const home = JSON.parse(localStorage.getItem("home")) || {};
    const banner = document.getElementById("banner");

    if (banner && home.cover) {
        banner.src = home.cover;
    }
}



// =====================================================
// 🚀 INIT
// =====================================================

syncAll();

window.addEventListener("storage", syncAll);
window.addEventListener("sync-all", syncAll);