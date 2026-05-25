
// =====================================================
// 📁 PIPASTORE ADMIN - VERSÃO FINAL LIMPA
// =====================================================



// =====================================================
// 📦 STORAGE GLOBAL
// =====================================================

let products = JSON.parse(localStorage.getItem("products")) || [];
let coupons = JSON.parse(localStorage.getItem("coupons")) || [];
let faqs = JSON.parse(localStorage.getItem("faqs")) || [];
let banners = JSON.parse(localStorage.getItem("banners")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let salesReports = JSON.parse(localStorage.getItem("salesReports")) || [];
let settings = JSON.parse(localStorage.getItem("settings")) || {};
let home = JSON.parse(localStorage.getItem("home")) || {};



// =====================================================
// 🔄 SINCRONIZAÇÃO GLOBAL (FONTE ÚNICA)
// =====================================================

function syncAll() {

    products = JSON.parse(localStorage.getItem("products")) || [];
    coupons = JSON.parse(localStorage.getItem("coupons")) || [];
    faqs = JSON.parse(localStorage.getItem("faqs")) || [];
    banners = JSON.parse(localStorage.getItem("banners")) || [];
    orders = JSON.parse(localStorage.getItem("orders")) || [];
    salesReports = JSON.parse(localStorage.getItem("salesReports")) || [];
    settings = JSON.parse(localStorage.getItem("settings")) || {};
    home = JSON.parse(localStorage.getItem("home")) || {};

    // re-render geral
    renderAdminProducts();
    renderCoupons();
    renderFAQ();
    renderBanners();
    renderOrders();
    renderReports();
    updateDashboard();
}



// =====================================================
// 📡 SINCRONIZAÇÃO ENTRE ABAS
// =====================================================

window.addEventListener("storage", syncAll);
window.addEventListener("sync-all", syncAll);



// =====================================================
// 🧭 TROCA DE TABS
// =====================================================

function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}



// =====================================================
// 📊 DASHBOARD
// =====================================================

function updateDashboard() {

    const productsEl = document.getElementById("dashboardProducts");
    const ordersEl = document.getElementById("dashboardOrders");
    const salesEl = document.getElementById("dashboardSales");

    if (productsEl) productsEl.innerText = products.length;
    if (ordersEl) ordersEl.innerText = orders.length;

    let total = 0;

    salesReports.forEach(o => {
        total += Number(o.total) || 0;
    });

    if (salesEl) salesEl.innerText = `R$ ${total}`;
}




// =====================================================
// 🖼️ PREVIEW PRODUTO
// =====================================================

function previewProductImage() {

    const url = document.getElementById("productImage").value;

    let previewContainer =
    document.getElementById("previewContainer");

    // CRIA CONTAINER
    if (!previewContainer) {

        previewContainer = document.createElement("div");
        previewContainer.id = "previewContainer";

        previewContainer.style.display = "flex";
        previewContainer.style.justifyContent = "center";
        previewContainer.style.alignItems = "center";
        previewContainer.style.marginTop = "20px";
        previewContainer.style.width = "100%";

        const preview = document.createElement("img");

        preview.id = "previewImage";

        preview.style.width = "180px";
        preview.style.height = "180px";
        preview.style.objectFit = "cover";

        preview.style.borderRadius = "18px";

        preview.style.border = "2px solid #2b2b2b";

        preview.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.35)";

        preview.style.background = "#111";

        preview.style.transition = "0.3s ease";

        preview.onmouseover = () => {
            preview.style.transform = "scale(1.04)";
        };

        preview.onmouseout = () => {
            preview.style.transform = "scale(1)";
        };

        previewContainer.appendChild(preview);

        document
            .querySelector(".form-fields")
            .appendChild(previewContainer);
    }

    const preview =
    document.getElementById("previewImage");

    preview.src = url;

    // ESCONDE SE NÃO TIVER URL
    if (!url.trim()) {
        previewContainer.style.display = "none";
    } else {
        previewContainer.style.display = "flex";
    }
}


// =====================================================
// 📦 ADICIONAR PRODUTO
// =====================================================

function addProduct() {

    const product = {
        id: Date.now(),
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        image: document.getElementById("productImage").value,
        price: Number(document.getElementById("productPrice").value) || 0,
        promo: Number(document.getElementById("productPromo").value) || 0,
        stock: Number(document.getElementById("productStock").value) || 0,
        category: document.getElementById("productCategory").value
    };

    if (!product.name || !product.image || !product.price) {
        alert("Preencha os campos!");
        return;
    }

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    clearProductFields();

    window.dispatchEvent(new CustomEvent("sync-all"));
}



// =====================================================
// 🧹 LIMPAR CAMPOS
// =====================================================

function clearProductFields() {

    ["productName","productDescription","productImage","productPrice","productPromo","productStock"]
    .forEach(id => document.getElementById(id).value = "");
}



// =====================================================
// 📦 RENDER PRODUTOS ADMIN
// =====================================================

function renderAdminProducts() {

    const container = document.getElementById("productsList");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {

        let status = "✅";
        let cls = "stock-ok";

        if (product.stock <= 0) {
            status = "❌ ";
            cls = "stock-out";
        } else if (product.stock <= 3) {
            status = "⚠️ ";
            cls = "stock-low";
        }

        container.innerHTML += `
        <div class="item product-card">

            <div class="product-image">
                <span class="product-status ${cls}">
                    ${status}
                </span>
                <img src="${product.image}">
            </div>

            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <strong>R$ ${product.price}</strong>

            <div class="product-actions">
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </div>

        </div>
        `;
    });

    updateDashboard();
}



// =====================================================
// 🗑️ DELETE PRODUTO
// =====================================================

function deleteProduct(id) {

    products = products.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));

    window.dispatchEvent(new CustomEvent("sync-all"));
}



// =====================================================
// ✏️ EDIT PRODUTO
// =====================================================

let editingProductId = null;

function editProduct(id) {

    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("productName").value = p.name;
    document.getElementById("productDescription").value = p.description;
    document.getElementById("productImage").value = p.image;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productPromo").value = p.promo || 0;
    document.getElementById("productStock").value = p.stock;
    document.getElementById("productCategory").value = p.category;

    editingProductId = id;
}



// =====================================================
// 🏷️ CUPONS
// =====================================================

function addCoupon() {

    coupons.push({
        id: Date.now(),
        code: document.getElementById("couponCode").value,
        discount: document.getElementById("couponDiscount").value,
        minimum: document.getElementById("couponMinimum").value,
        limit: document.getElementById("couponLimit").value,
        expire: document.getElementById("couponExpire").value,
        type: document.getElementById("couponType").value,
        used: 0,
        active: true
    });

    localStorage.setItem("coupons", JSON.stringify(coupons));

    window.dispatchEvent(new CustomEvent("sync-all"));
}



// =====================================================
// ❓ FAQ
// =====================================================

function addFAQ() {

    const question = document.getElementById("faqQuestion").value;
    const answer = document.getElementById("faqAnswer").value;

    if (!question || !answer) {
        alert("Preencha tudo!");
        return;
    }

    faqs.push({
        id: Date.now(),
        question,
        answer
    });

    localStorage.setItem("faqs", JSON.stringify(faqs));

    document.getElementById("faqQuestion").value = "";
    document.getElementById("faqAnswer").value = "";

    window.dispatchEvent(new CustomEvent("sync-all"));
}



// =====================================================
// 🧾 RENDER FAQ
// =====================================================

function renderFAQ() {

    const container = document.getElementById("faqList");
    if (!container) return;

    container.innerHTML = "";

    faqs.forEach(f => {
        container.innerHTML += `
        <div class="item">
            <h3>${f.question}</h3>
            <p>${f.answer}</p>
        </div>
        `;
    });
}



// =====================================================
// 🖼️ BANNERS PREVIEW
// =====================================================

function previewBanner() {

    document.getElementById("bannerPreviewImage").src =
        document.getElementById("bannerImage").value;

    document.getElementById("bannerPreviewTitle").innerText =
        document.getElementById("bannerTitle").value;

    document.getElementById("bannerPreviewSubtitle").innerText =
        document.getElementById("bannerSubtitle").value;
}



// =====================================================
// ➕ ADD BANNER
// =====================================================

function addBanner() {

    banners.push({
        id: Date.now(),
        title: document.getElementById("bannerTitle").value,
        subtitle: document.getElementById("bannerSubtitle").value,
        image: document.getElementById("bannerImage").value,
        color: document.getElementById("bannerColor").value
    });

    localStorage.setItem("banners", JSON.stringify(banners));

    window.dispatchEvent(new CustomEvent("sync-all"));
}



// =====================================================
// 🚀 INIT
// =====================================================

syncAll();

function renderCoupons() {

    const container = document.getElementById("couponList");
    if (!container) return;

    container.innerHTML = "";

    coupons.forEach(c => {

        container.innerHTML += `
        <div class="item">

            <h3>🎟️ ${c.code}</h3>
            <p>Desconto: ${c.discount}</p>
            <p>Tipo: ${c.type}</p>
            <p>Usos: ${c.used}</p>

            <button onclick="deleteCoupon(${c.id})">🗑️</button>

        </div>
        `;
    });
}

function renderCoupons() {

    const container = document.getElementById("couponList");
    if (!container) return;

    container.innerHTML = "";

    coupons.forEach(c => {

        container.innerHTML += `
        <div class="item">

            <h3>🎟️ ${c.code}</h3>
            <p>Desconto: ${c.discount}</p>
            <p>Tipo: ${c.type}</p>
            <p>Usos: ${c.used}</p>

            <button onclick="deleteCoupon(${c.id})">🗑️</button>

        </div>
        `;
    });
}

function renderCoupons() {

    const container = document.getElementById("couponList");
    if (!container) return;

    container.innerHTML = "";

    coupons.forEach(c => {

        container.innerHTML += `
        <div class="item">

            <h3>🎟️ ${c.code}</h3>
            <p>Desconto: ${c.discount}</p>
            <p>Tipo: ${c.type}</p>
            <p>Usos: ${c.used}</p>

            <button onclick="deleteCoupon(${c.id})">🗑️</button>

        </div>
        `;
    });
}

function renderCoupons() {

    const container = document.getElementById("couponList");
    if (!container) return;

    container.innerHTML = "";

    coupons.forEach(c => {

        container.innerHTML += `
        <div class="item">

            <h3>🎟️ ${c.code}</h3>
            <p>Desconto: ${c.discount}</p>
            <p>Tipo: ${c.type}</p>
            <p>Usos: ${c.used}</p>

            <button onclick="deleteCoupon(${c.id})">🗑️</button>

        </div>
        `;
    });
}

function deleteCoupon(id) {

    coupons = coupons.filter(c => c.id !== id);
    localStorage.setItem("coupons", JSON.stringify(coupons));

    window.dispatchEvent(new CustomEvent("sync-all"));
}

function renderBanners() {

    const container = document.getElementById("bannerList");
    if (!container) return;

    container.innerHTML = "";

    banners.forEach(b => {

        container.innerHTML += `
        <div class="item">

            <h3>${b.title}</h3>
            <p>${b.subtitle}</p>

            <img src="${b.image}" style="width:100px;border-radius:8px">

            <button onclick="deleteBanner(${b.id})">🗑️</button>

        </div>
        `;
    });
}

function deleteBanner(id) {

    banners = banners.filter(b => b.id !== id);
    localStorage.setItem("banners", JSON.stringify(banners));

    window.dispatchEvent(new CustomEvent("sync-all"));
}

function renderOrders() {

    const container = document.getElementById("ordersList");
    if (!container) return;

    container.innerHTML = "";

    orders.forEach(o => {

        container.innerHTML += `
        <div class="item">

            <h3>Pedido #${o.id}</h3>
            <p>Status: ${o.status || "pendente"}</p>
            <p>Total: R$ ${o.total || 0}</p>

        </div>
        `;
    });
}

function renderReports() {

    const container = document.getElementById("reportsList");
    if (!container) return;

    container.innerHTML = "";

    salesReports.forEach(r => {

        container.innerHTML += `
        <div class="item">
            <h3>Venda</h3>
            <p>Total: R$ ${r.total}</p>
        </div>
        `;
    });
}


// =====================================================
// 💾 SALVAR
// =====================================================
function saveOrders(){
    localStorage.setItem("orders", JSON.stringify(orders));
}

// =====================================================
// 🔄 TROCAR STATUS
// =====================================================

function updateOrderStatus(id, status) {

    id = Number(id);

    orders = orders.map(order =>
        Number(order.id) === id
            ? { ...order, status }
            : order
    );

    localStorage.setItem("orders", JSON.stringify(orders));

    renderOrders(); // 🔥 SEM currentFilter
    updateDashboard();
}
// =====================================================
// 🎯 FILTRO
// =====================================================
function filterOrders(filter){
    currentFilter = filter;
    renderOrders(filter);
}

// =====================================================
// 📦 RENDER
// =====================================================
function renderOrders(filter = "all"){

    const container = document.getElementById("ordersList");
    if(!container) return;

    container.innerHTML = "";

    let filtered = orders;

    if(filter !== "all"){
        filtered = orders.filter(o => o.status === filter);
    }

    if(filtered.length === 0){
        container.innerHTML = `
            <div class="empty-orders">
                Nenhum pedido encontrado
            </div>
        `;
        return;
    }

    filtered.forEach(order => {

        const itemsHTML = (order.items || []).map(item => `
            <div class="order-product">
                <img src="${item.image}" />
                <div>
                    <h4>${item.name}</h4>
                    <p>Qtd: ${item.qty}</p>
                    <p>R$ ${item.price}</p>
                </div>
            </div>
        `).join("");

        container.innerHTML += `
        <div class="order-card">

            <div class="order-top">
                <h3>Pedido #${order.id}</h3>
                <span>${order.date}</span>
            </div>

            <div class="order-status ${order.status}">
                ${getStatusLabel(order.status)}
            </div>

            <div class="order-items">
                ${itemsHTML}
            </div>

            <div class="order-info">
                <p><strong>Cliente:</strong> ${order.customer}</p>
                <h2>Total: R$ ${order.total}</h2>
            </div>

            <div class="order-actions">

                <button onclick="updateOrderStatus(${order.id}, 'pending')">Pendente</button>
                <button onclick="updateOrderStatus(${order.id}, 'paid')">Pago</button>
                <button onclick="updateOrderStatus(${order.id}, 'shipping')">Enviado</button>
                <button onclick="updateOrderStatus(${order.id}, 'delivered')">Entregue</button>
                <button onclick="updateOrderStatus(${order.id}, 'cancelled')">Cancelado</button>

            </div>

        </div>
        `;
    });
}

// =====================================================
// 🏷️ LABEL STATUS
// =====================================================
function getStatusLabel(status){

    const map = {
        pending: "PENDENTE",
        paid: "PAGO",
        shipping: "ENVIADO",
        delivered: "ENTREGUE",
        cancelled: "CANCELADO"
    };

    return map[status] || status;
}

// inicial
renderOrders();

