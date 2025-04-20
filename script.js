// Initialize cart and wishlist arrays
let cart = [];
let wishlist = [];

// DOM Content Loaded - Run when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    setupEventListeners();
    loadFromLocalStorage();
    updateCartCount();
    updateWishlistCount();
    
    // Hide cart and wishlist pages on initial load
    document.getElementById('cart-page').style.display = 'none';
    document.getElementById('wishlist-page').style.display = 'none';
});

// Setup all event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(name, price);
        });
    });
    
    // Add to wishlist buttons
    document.querySelectorAll('.add-to-wishlist, .heart').forEach(button => {
        button.addEventListener('click', function() {
            const productEl = this.closest('.product');
            const name = productEl.querySelector('h3').textContent;
            const price = parseFloat(productEl.querySelector('p').textContent.replace('$', ''));
            const image = productEl.querySelector('img').src;
            addToWishlist(name, price, image);
        });
    });
    
    // Sort select dropdowns
    document.querySelectorAll('select#sort').forEach(select => {
        select.addEventListener('change', sortProducts);
    });
}

// Add item to cart
function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Update UI and storage
    updateCartCount();
    updateCartDisplay();
    saveToLocalStorage();
    showNotification(`${name} added to cart!`);
}

// Add item to wishlist
function addToWishlist(name, price, image) {
    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.findIndex(item => item.name === name);
    
    if (existingItemIndex === -1) {
        // Add new item to wishlist
        wishlist.push({
            name: name,
            price: price,
            image: image
        });
        
        // Update UI and storage
        updateWishlistCount();
        updateWishlistDisplay();
        saveToLocalStorage();
        showNotification(`${name} added to wishlist!`);
    } else {
        showNotification(`${name} is already in your wishlist!`);
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    saveToLocalStorage();
}

// Change quantity of item in cart
function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    
    // Remove item if quantity reaches 0
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
        saveToLocalStorage();
    }
}

// Remove item from wishlist
function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistCount();
    updateWishlistDisplay();
    saveToLocalStorage();
}

// Move item from wishlist to cart
function moveToCart(index) {
    const item = wishlist[index];
    addToCart(item.name, item.price);
    removeFromWishlist(index);
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update wishlist count badge
function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    wishlistCount.textContent = wishlist.length;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    let total = 0;
    
    // Clear current items
    cartItems.innerHTML = '';
    
    // Add each item to the cart display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
                <div class="item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            `;
            
            cartItems.appendChild(cartItemDiv);
        });
    }
    
    // Update total price
    totalPrice.textContent = total.toFixed(2);
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlistItems = document.getElementById('wishlist-items');
    
    // Clear current items
    wishlistItems.innerHTML = '';
    
    // Add each item to the wishlist display
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p>Your wishlist is empty</p>';
    } else {
        wishlist.forEach((item, index) => {
            const wishlistItemDiv = document.createElement('div');
            wishlistItemDiv.className = 'wishlist-item';
            wishlistItemDiv.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" width="100">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <button onclick="moveToCart(${index})">Add to Cart</button>
                    <button onclick="removeFromWishlist(${index})">Remove</button>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItemDiv);
        });
    }
}

// Show cart page
function showCartPage() {
    // Hide other sections
    document.getElementById('shop-page').style.display = 'none';
    document.getElementById('shop-page1').style.display = 'none';
    document.getElementById('p1').style.display = 'none';
    document.getElementById('p2').style.display = 'none';
    document.getElementById('pad1').style.display = 'none';
    document.getElementById('wishlist-page').style.display = 'none';
    
    // Show cart page
    document.getElementById('cart-page').style.display = 'block';
    
    // Update cart display
    updateCartDisplay();
}

// Show wishlist page
function showWishlist() {
    // Hide other sections
    document.getElementById('shop-page').style.display = 'none';
    document.getElementById('shop-page1').style.display = 'none';
    document.getElementById('p1').style.display = 'none';
    document.getElementById('p2').style.display = 'none';
    document.getElementById('pad1').style.display = 'none';
    document.getElementById('cart-page').style.display = 'none';
    
    // Show wishlist page
    document.getElementById('wishlist-page').style.display = 'block';
    
    // Update wishlist display
    updateWishlistDisplay();
}

// Show shop page (return to main product listing)
function showShopPage() {
    // Show product sections
    document.getElementById('shop-page').style.display = 'grid';
    document.getElementById('shop-page1').style.display = 'grid';
    document.getElementById('p1').style.display = 'block';
    document.getElementById('p2').style.display = 'block';
    document.getElementById('pad1').style.display = 'block';
    
    // Hide cart and wishlist pages
    document.getElementById('cart-page').style.display = 'none';
    document.getElementById('wishlist-page').style.display = 'none';
}

// Filter products based on search term
function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sort products by price
function sortProducts() {
    const sortValue = this.value;
    const parentSection = this.closest('div').nextElementSibling;
    const products = Array.from(parentSection.querySelectorAll('.product'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('p').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('p').textContent.replace('$', ''));
        
        if (sortValue === 'price-asc') {
            return priceA - priceB;
        } else if (sortValue === 'price-desc') {
            return priceB - priceA;
        }
        return 0;
    });
    
    // Remove all products
    products.forEach(product => product.remove());
    
    // Add sorted products back
    products.forEach(product => {
        parentSection.appendChild(product);
    });
}

// Save cart and wishlist to localStorage
function saveToLocalStorage() {
    localStorage.setItem('buymeCart', JSON.stringify(cart));
    localStorage.setItem('buymeWishlist', JSON.stringify(wishlist));
}

// Load cart and wishlist from localStorage
function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('buymeCart');
    const savedWishlist = localStorage.getItem('buymeWishlist');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}