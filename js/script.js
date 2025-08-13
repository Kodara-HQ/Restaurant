// Cart functionality for Restaurant Hub
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    // Helper method to get currency symbol based on restaurant
    getCurrencySymbol(restaurant) {
        // Ghanaian restaurants use Ghanaian Cedi (₵)
        if (restaurant && (restaurant.includes('Esbak') || restaurant.includes('framiclad') || restaurant.includes('Sika'))) {
            console.log(`Currency for ${restaurant}: ₵ (Ghanaian)`);
            return '₵';
        }
        // Default to dollar sign for other restaurants
        console.log(`Currency for ${restaurant}: ₵ (Default)`);
        return '₵';
    }

    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Cart button click
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        // Close cart button
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Cart overlay click
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Place order button
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }

        // Close cart on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCart();
            }
        });
    }

    addItem(name, price, restaurant, image = null) {
        const existingItem = this.items.find(item => 
            item.name === name && item.restaurant === restaurant
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name,
                price,
                restaurant,
                image,
                quantity: 1
            });
        }

        this.updateCart();
        this.showNotification(`${name} added to cart!`);
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.updateCart();
    }

    updateQuantity(index, change) {
        const item = this.items[index];
        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeItem(index);
        } else {
            this.updateCart();
        }
    }

    updateCart() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p class="text-muted">Add some delicious items to get started!</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.items.map((item, index) => `
                    <div class="cart-item fade-in">
                        <img src="${item.image || 'images/default-food.jpg'}" alt="${item.name}" onerror="this.src='images/default-food.jpg'">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-restaurant text-muted small">${item.restaurant}</div>
                            <div class="cart-item-price">${this.getCurrencySymbol(item.restaurant)}${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, -1)">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="cart.removeItem(${index})">×</button>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            cartTotal.textContent = this.total.toFixed(2);
        }

        // Update currency symbol in cart total
        const cartTotalCurrency = document.getElementById('cartTotalCurrency');
        if (cartTotalCurrency && this.items.length > 0) {
            // Use the currency of the first restaurant in the cart
            cartTotalCurrency.textContent = this.getCurrencySymbol(this.items[0].restaurant);
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartSidebar && cartOverlay) {
            if (cartSidebar.classList.contains('open')) {
                this.closeCart();
            } else {
                this.openCart();
            }
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Force currency update when cart is opened
            this.forceCurrencyUpdate();
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    saveCart() {
        localStorage.setItem('restaurantHubCart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    loadCart() {
        const savedCart = localStorage.getItem('restaurantHubCart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.total = cartData.total || 0;
                
                // Force currency update after loading cart
                if (this.items.length > 0) {
                    setTimeout(() => this.forceCurrencyUpdate(), 100);
                }
            } catch (e) {
                console.error('Error loading cart:', e);
                this.items = [];
                this.total = 0;
            }
        }
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.updateCart();
    }

    refreshCartDisplay() {
        // Force refresh the cart display to update currency symbols
        this.updateCartDisplay();
    }

    forceCurrencyUpdate() {
        // Force update currency display for all items
        if (this.items.length > 0) {
            console.log('Forcing currency update for cart items...');
            this.updateCartDisplay();
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'alert alert-success fade-in';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    placeOrder() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        // Create order summary
        const orderSummary = this.items.map(item => 
            `${item.name} (${item.quantity}x) - ${this.getCurrencySymbol(item.restaurant)}${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const totalAmount = this.total.toFixed(2);
        const restaurantNames = [...new Set(this.items.map(item => item.restaurant))];

        // Show order confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1070;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle me-2"></i>Order Placed Successfully!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <strong>Restaurant(s):</strong> ${restaurantNames.join(', ')}
                        </div>
                        <h6>Order Summary:</h6>
                        <div class="order-items mb-3" style="max-height: 200px; overflow-y: auto;">
                            ${this.items.map(item => `
                                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                                    <span>${item.name} (${item.quantity}x)</span>
                                    <span class="text-success">${this.getCurrencySymbol(item.restaurant)}${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="text-center">
                            <h5 class="text-success">Total: ${this.getCurrencySymbol(restaurantNames[0])}${totalAmount}</h5>
    
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                        <button type="button" class="btn btn-success" onclick="cart.confirmOrder()">Confirm Order</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    confirmOrder() {
        // Close cart modal
        this.closeCart();
        
        // Remove modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    }
}

// Global cart instance
let cart;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart = new Cart();
});

// Global function for adding items to cart (used in HTML onclick)
function addToCart(name, price, restaurant, image = null) {
    if (cart) {
        cart.addItem(name, price, restaurant, image);
    }
}

// Function to show dine-in information
function showDineInInfo() {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1070;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-store me-2"></i>Dine-In Information
                    </h5>
                    <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6><i class="fas fa-clock me-2"></i>Opening Hours</h6>
                            <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                            <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                        </div>
                        <div class="col-md-6">
                            <h6><i class="fas fa-map-marker-alt me-2"></i>Location</h6>
                            <p>123 Main Street<br>Downtown Area<br>City, State 12345</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h6><i class="fas fa-info-circle me-2"></i>Additional Information</h6>
                        <ul>
                            <li>Reservations recommended for groups of 6+</li>
                            <li>Free parking available</li>
                            <li>Wheelchair accessible</li>
                            <li>Private dining room available</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <a href="tel:+1234567890" class="btn btn-primary">
                        <i class="fas fa-phone me-2"></i>Call for Reservations
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('quantity-btn') && !this.classList.contains('cart-item-remove')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
});

// Add fade-in animation to elements when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.restaurant-card, .menu-item, .order-method-card');
    elements.forEach(el => observer.observe(el));
});
