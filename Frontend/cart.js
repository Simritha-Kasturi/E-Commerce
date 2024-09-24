let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from API
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(products);
    })
    .catch(err => console.error(err));

// Display the products
function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';  
    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.title}">
                <p>${product.title}</p>
                <p>₹${product.price}</p>
                <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
            </div>
        `;
    });
}

// Add product to the cart
function addToCart(id, name, price) {
    const item = cart.find(product => product.id === id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Remove product from the cart
function removeFromCart(id) {
    cart = cart.filter(product => product.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Update quantity of cart items
function updateQuantity(id, amount) {
    const item = cart.find(product => product.id === id);
    if (item) {
        item.quantity += amount;
        if (item.quantity === 0) {
            removeFromCart(id);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Display cart items
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';  
    cart.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${products.find(p => p.id === item.id).image}" alt="${item.name}">
                <p>${item.name}</p>
                <p>₹${item.price} x ${item.quantity}</p>
                <div class="cart-actions">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });
    calculateTotal();
}


function calculateTotal() {
    const totalMRP = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = 50;  
    const platformFee = 10;
    const shippingCharges = 20;
    const totalAmount = totalMRP - discount + platformFee + shippingCharges;

    document.getElementById('total-mrp').textContent = `₹${totalMRP}`;
    document.getElementById('total-amount').textContent = `₹${totalAmount}`;
}


function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}


function placeOrder() {
    alert('Order placed successfully!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}


renderCart();
