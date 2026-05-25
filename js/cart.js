// =====================================================
// 🛒 CARRINHO
// =====================================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let discount = 0;



// =====================================================
// 🔄 SINCRONIZAÇÃO (IMPORTANTE)
// =====================================================

function syncCart(){
    cart = JSON.parse(localStorage.getItem("cart")) || [];
}



// =====================================================
// 💾 SALVAR
// =====================================================

function save() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    render();
    updateCartCount();
}



// =====================================================
// 🔴 BADGE
// =====================================================

function updateCartCount() {

    const badge =
        document.getElementById("cartCount");

    if (!badge) return;

    syncCart(); // 🔥 evita contador errado

    let total = 0;

    cart.forEach(item => {
        total += item.qty || 1; // 🔥 evita undefined
    });

    badge.innerText = total;

    badge.style.display =
        total > 0 ? "flex" : "none";
}



// =====================================================
// 🖼️ RENDER
// =====================================================

function render() {

    const container =
        document.getElementById("cartContainer");

    if (!container) return;

    syncCart(); // 🔥 sempre atualizado

    container.innerHTML = "";

    if (cart.length <= 0) {

        container.innerHTML = `
            <div class="empty">
                
            </div>
        `;

        updateTotal();
        return;
    }

    cart.forEach((item, i) => {

        const qty = item.qty || 1; // 🔥 proteção

        container.innerHTML += `

        <div class="item">

            <img src="${item.image}" width="80">

            <div class="info">

                <h3>${item.name}</h3>

                <div class="price">
                    R$ ${Number(item.price).toFixed(2)}
                </div>

                <div class="controls">

                    <button onclick="minus(${i})">-</button>

                    <span>${qty}</span>

                    <button onclick="plus(${i})">+</button>

                    <button onclick="removeItem(${i})">❌</button>

                </div>

            </div>

        </div>
        `;
    });

    updateTotal();
}



// =====================================================
// ➕ MAIS
// =====================================================

function plus(i) {

    syncCart();

    cart[i].qty = (cart[i].qty || 1) + 1;

    save();
}



// =====================================================
// ➖ MENOS
// =====================================================

function minus(i) {

    syncCart();

    cart[i].qty = (cart[i].qty || 1) - 1;

    if (cart[i].qty <= 0) {
        cart.splice(i, 1);
    }

    save();
}



// =====================================================
// ❌ REMOVER
// =====================================================

function removeItem(i) {

    syncCart();

    cart.splice(i, 1);

    save();
}



// =====================================================
// 💰 TOTAL
// =====================================================

function updateTotal() {

    let total = 0;

    cart.forEach(item => {

        const qty = item.qty || 1;

        total += Number(item.price) * qty;
    });

    total = total - (total * discount);

    document.getElementById("subtotal").innerText =
        "R$ " + total.toFixed(2);

    document.getElementById("total").innerText =
        "R$ " + total.toFixed(2);
}



// =====================================================
// 🎟️ CUPOM
// =====================================================

function applyCoupon() {

    const code =
        document.getElementById("couponInput").value;

    if (code == "PIPA10") {

        discount = 0.10;

        alert("Cupom aplicado!");

    } else {

        alert("Cupom inválido");
    }

    updateTotal();
}



// =====================================================
// 📲 WHATSAPP
// =====================================================

function checkoutWhatsApp() {

    if (cart.length <= 0) {
        alert("Carrinho vazio!");
        return;
    }

    const name =
        document.getElementById("name").value || "Não informado";

    const phone =
        document.getElementById("phone").value || "Não informado";

    let total = 0;

    let message = `🪁 *PEDIDO PIPASTORE*\n\n`;

    cart.forEach(item => {

        const qty = item.qty || 1;

        const subtotal = item.price * qty;

        total += subtotal;

        message +=
`📦 ${item.name}
Quantidade: ${qty}
Valor: R$ ${Number(item.price).toFixed(2)}
Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
    });

    total = total - (total * discount);

    message += `💰 TOTAL: R$ ${total.toFixed(2)}\n\n`;

    message += `👤 Cliente: ${name}
📱 Telefone: ${phone}`;

    // =====================================================
    // SALVAR PEDIDO
    // =====================================================

    let orders =
    JSON.parse(localStorage.getItem("orders")) || [];

    const orderId =
    "#PIPA" + Math.floor(Math.random() * 99999);

    const order = {

        id: orderId,

        items: cart,

        total: total.toFixed(2),

        customer: name,

        phone: phone,

        status: "pending",

        date: new Date().toLocaleDateString("pt-BR")
    };

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    // =====================================================
    // WHATSAPP
    // =====================================================

    const url =
`https://wa.me/554197070233?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}


// =====================================================
// 🚀 INICIAR
// =====================================================

updateCartCount();
render();