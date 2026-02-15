// ============================================
// Supabase Channel Setup
// ============================================
const myChannel = supabase.channel('room-1');

myChannel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
        console.log('Connected!');
    }
});

window.addEventListener('beforeunload', () => {
    supabase.removeChannel(myChannel);
});

// ============================================
// Sound and Ripple Effect
// ============================================
const wrap = document.getElementById('logoWrap');

function playPop() {
    const sound = new Audio('mp3/ccc.mp3');
    sound.volume = 0.8;
    sound.play();
}

function spawnRipple() {
    const r = document.createElement('div');
    r.className = 'ripple';
    wrap.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
}

document.getElementById('devLogo').addEventListener('click', () => {
    playPop();
    spawnRipple();
});

// ============================================
// Click Counter for Secret Page
// ============================================
var clickCount = 0;

function checkClicks() {
    clickCount++;
    if (clickCount >= 3) {
        window.location.href = 'secret.html';
    }
}

// ============================================
// Back to Top Button
// ============================================
const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// ============================================
// Search Products Function
// ============================================
function searchProducts() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('product-card');

    for (let i = 0; i < cards.length; i++) {
        let productName = cards[i].querySelector('.product-name').innerText.toLowerCase();
        let category = cards[i].getAttribute('data-category').toLowerCase();

        if (productName.includes(input) || category.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// ============================================
// Cart and Product Management
// ============================================
let cart = [];
let currentProduct = {};

// Filter products by category
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const categories = document.querySelectorAll('.category');

    categories.forEach(cat => cat.classList.remove('active'));
    event.target.classList.add('active');

    products.forEach(product => {
        if (category === 'الكل' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Show product details
function showProductDetails(name, image, prices, sizes, prepTime) {
    currentProduct = {
        name: name,
        image: image,
        prices: prices,
        sizes: sizes,
        prepTime: prepTime,
        selectedSize: sizes[0],
        quantity: 1
    };

    const modal = document.getElementById('productModal');
    if (!modal) {
        createProductModal();
    }

    updateProductModal();
    document.getElementById('productModal').style.display = 'block';
}

// Create product modal
function createProductModal() {
    const modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <button class="close-modal" onclick="closeProductModal()">×</button>
                <h2 id="modal-product-name"></h2>
            </div>
            <div class="modal-body">
                <img id="modal-product-image" src="" alt="" style="width: 100%; border-radius: 12px; margin-bottom: 1rem;">
                <h3 style="margin-bottom: 0.5rem;">اختر الحجم:</h3>
                <div class="size-options" id="size-options"></div>
                <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">الكمية:</h3>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                    <div class="quantity-display" id="quantity-display">1</div>
                    <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                </div>
                <div class="cart-total" id="modal-price">السعر: 0 دينار</div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="addToCart()">إضافة إلى السلة</button>
                <button class="btn btn-secondary" onclick="closeProductModal()">إلغاء</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProductModal();
        }
    });
}

// Update product modal
function updateProductModal() {
    document.getElementById('modal-product-name').textContent = currentProduct.name;
    document.getElementById('modal-product-image').src = currentProduct.image;
    document.getElementById('quantity-display').textContent = currentProduct.quantity;

    const sizeOptions = document.getElementById('size-options');
    sizeOptions.innerHTML = '';

    currentProduct.sizes.forEach(size => {
        const sizeBtn = document.createElement('div');
        sizeBtn.className = 'size-option' + (size === currentProduct.selectedSize ? ' selected' : '');
        sizeBtn.textContent = `${size} - ${currentProduct.prices[size]} دينار`;
        sizeBtn.onclick = () => selectSize(size, sizeBtn);
        sizeOptions.appendChild(sizeBtn);
    });

    updateModalPrice();
}

// Select size
function selectSize(size, element) {
    currentProduct.selectedSize = size;
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    updateModalPrice();
}

// Increase quantity
function increaseQuantity() {
    currentProduct.quantity++;
    document.getElementById('quantity-display').textContent = currentProduct.quantity;
    updateModalPrice();
}

// Decrease quantity
function decreaseQuantity() {
    if (currentProduct.quantity > 1) {
        currentProduct.quantity--;
        document.getElementById('quantity-display').textContent = currentProduct.quantity;
        updateModalPrice();
    }
}

// Update modal price
function updateModalPrice() {
    const price = currentProduct.prices[currentProduct.selectedSize] * currentProduct.quantity;
    document.getElementById('modal-price').textContent = `السعر: ${price} دينار`;
}

// Add to cart
function addToCart() {
    const item = {
        name: currentProduct.name,
        size: currentProduct.selectedSize,
        quantity: currentProduct.quantity,
        price: currentProduct.prices[currentProduct.selectedSize],
        total: currentProduct.prices[currentProduct.selectedSize] * currentProduct.quantity,
        prepTime: currentProduct.prepTime
    };

    cart.push(item);
    updateCartCount();
    showAlert('تم إضافة المنتج إلى السلة بنجاح', 'success');
    closeProductModal();
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Open cart
function openCart() {
    if (cart.length === 0) {
        showAlert('السلة فارغة!', 'warning');
        return;
    }

    const modal = document.getElementById('cartModal');
    if (!modal) {
        createCartModal();
    }

    updateCartModal();
    document.getElementById('cartModal').style.display = 'block';
}

// Create cart modal
function createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <button class="close-modal" onclick="closeCart()">×</button>
                <h2>🛒 سلة المشتريات</h2>
            </div>
            <div class="modal-body" id="cart-items"></div>
            <div class="total-prep-time" id="total-prep-time"></div>
            <div class="cart-total" id="cart-total">الإجمالي: 0 دينار</div>
            <div class="modal-footer">
                <button class="btn" onclick="proceedToCheckout()">إتمام الطلب</button>
                <button class="btn btn-secondary" onclick="closeCart()">متابعة التسوق</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCart();
        }
    });
}

// Update cart modal
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">السلة فارغة</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                <small>الحجم: ${item.size} | الكمية: ${item.quantity}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <strong style="color: var(--primary-color);">${item.total} دينار</strong>
                <button class="btn btn-danger" style="padding: 0.5rem;" onclick="removeFromCart(${index})">🗑️</button>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('cart-total').textContent = `الإجمالي: ${total} دينار`;

    const totalPrepTime = Math.max(...cart.map(item => item.prepTime));
    document.getElementById('total-prep-time').textContent = `⏱️ وقت التحضير المتوقع: ${totalPrepTime} دقيقة`;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartModal();
    showAlert('تم حذف المنتج من السلة', 'error');
}

// Close cart
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Proceed to checkout
function proceedToCheckout() {
    closeCart();
    const modal = document.getElementById('checkoutModal');
    if (!modal) {
        createCheckoutModal();
    }
    document.getElementById('checkoutModal').style.display = 'block';
}

// Create checkout modal
function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <button class="close-modal" onclick="closeCheckout()">×</button>
                <h2>📝 إتمام الطلب</h2>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="customer-name">الاسم الكامل *</label>
                    <input type="text" id="customer-name" placeholder="أدخل اسمك الكامل" required>
                    <div class="form-error" id="name-error">الرجاء إدخال الاسم</div>
                </div>

                <div class="form-group">
                    <label for="customer-phone">رقم الهاتف *</label>
                    <input type="tel" id="customer-phone" placeholder="07XXXXXXXX" required>
                    <div class="form-error" id="phone-error">الرجاء إدخال رقم هاتف صحيح (يبدأ بـ 07)</div>
                </div>

                <div class="form-group">
                    <label>طريقة الاستلام *</label>
                    <div class="delivery-cards">
                        <div class="delivery-card active" onclick="selectDelivery(this, true)">
                            <div class="icon">🚚</div>
                            <h4>توصيل</h4>
                            <p>يوصل الطلب إلى باب المنزل</p>
                            <input type="radio" name="deliveryMethod" value="delivery" checked hidden>
                        </div>

                        <div class="delivery-card" onclick="selectDelivery(this, false)">
                            <div class="icon">🏪</div>
                            <h4>استلام</h4>
                            <p>استلام الطلب من المطعم</p>
                            <input type="radio" name="deliveryMethod" value="pickup" hidden>
                        </div>
                    </div>
                </div>

                <div class="form-group" id="location-group">
                    <label for="customer-location">العنوان *</label>
                    <textarea id="customer-location" placeholder="أدخل عنوانك التفصيلي" required></textarea>
                    <div class="form-error" id="location-error">الرجاء إدخال العنوان</div>
                </div>

                <div class="form-group">
                    <label for="customer-notes">ملاحظات إضافية (اختياري)</label>
                    <textarea id="customer-notes" placeholder="أي ملاحظات خاصة بالطلب"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="submitOrder()">إرسال الطلب 📱</button>
                <button class="btn btn-secondary" onclick="closeCheckout()">رجوع</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCheckout();
        }
    });
}

// Toggle location field
function toggleLocation(isDelivery) {
    const locationGroup = document.getElementById('location-group');
    const locationInput = document.getElementById('customer-location');
    const locationLabel = locationGroup.querySelector('label');

    if (isDelivery) {
        locationGroup.style.display = 'block';
        locationInput.required = true;
        locationLabel.innerHTML = 'العنوان *';
    } else {
        locationGroup.style.display = 'none';
        locationInput.required = false;
        locationInput.value = '';
        locationLabel.innerHTML = 'العنوان (اختياري)';
    }
}

// Close checkout
function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const location = document.getElementById('customer-location').value.trim();
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;

    document.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
    document.querySelectorAll('input, textarea').forEach(input => input.style.borderColor = 'var(--border-color)');

    if (!name) {
        document.getElementById('name-error').style.display = 'block';
        document.getElementById('customer-name').style.borderColor = 'var(--danger-color)';
        isValid = false;
    }

    const phoneRegex = /^07[0-9]{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
        document.getElementById('phone-error').style.display = 'block';
        document.getElementById('customer-phone').style.borderColor = 'var(--danger-color)';
        isValid = false;
    }

    if (deliveryMethod === 'delivery' && !location) {
        document.getElementById('location-error').style.display = 'block';
        document.getElementById('customer-location').style.borderColor = 'var(--danger-color)';
        isValid = false;
    }

    return isValid;
}

// Submit order
function submitOrder() {
    if (!validateForm()) {
        return;
    }

    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const location = document.getElementById('customer-location').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const deliveryText = deliveryMethod === 'delivery' ? '🚚 توصيل' : '🏪 استلام من المطعم';

    let message = `🛒 *طلب جديد من مطعم نكشه المركزي*\n\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *الهاتف:* ${phone}\n`;
    message += `📦 *طريقة الاستلام:* ${deliveryText}\n`;

    if (deliveryMethod === 'delivery') {
        message += `📍 *العنوان:* ${location}\n`;
    }

    message += `\n📦 *تفاصيل الطلب:*\n`;
    message += `━━━━━━━━━━━━━━━━\n`;

    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   الحجم: ${item.size}\n`;
        message += `   الكمية: ${item.quantity}\n`;
        message += `   السعر: ${item.total} دينار\n\n`;
        total += item.total;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *الإجمالي: ${total} دينار*\n\n`;

    const totalPrepTime = Math.max(...cart.map(item => item.prepTime));
    message += `⏱️ *وقت التحضير المتوقع:* ${totalPrepTime} دقيقة\n\n`;

    if (notes) {
        message += `📝 *ملاحظات:* ${notes}\n\n`;
    }

    message += `⏰ وقت الطلب: ${new Date().toLocaleString('ar-JO')}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '962788709412';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    cart = [];
    updateCartCount();
    closeCheckout();

    showAlert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success');

    setTimeout(() => {
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-location').value = '';
        document.getElementById('customer-notes').value = '';
    }, 1000);
}

// Show alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Drag and scroll functionality
(function() {
    const slider = document.getElementById('categoriesContainer');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
})();

// Select delivery method
function selectDelivery(card, isDelivery) {
    document.querySelectorAll('.delivery-card').forEach(c => {
        c.classList.remove('active');
        c.querySelector('input').checked = false;
    });

    card.classList.add('active');
    card.querySelector('input').checked = true;

    toggleLocation(isDelivery);
}

// ============================================
// Supabase Inventory Management
// ============================================
const MY_PROJECT_URL = 'https://nxcjnxtvkacsaiikglhy.supabase.co';
const MY_PROJECT_KEY = 'sb_publishable_AbkphcROGqeua_aCIc_fAA_b8KNnYRh';
const restaurantSupabase = supabase.createClient(MY_PROJECT_URL, MY_PROJECT_KEY);

let inventoryChannel = null;
let isIdle = false;
let interactionTimer = null;
let syncTimer = null;
let lastSyncTime = 0;
const IDLE_TIMEOUT = 120000; // 2 minutes
const SYNC_INTERVAL = 60000; // 1 minute
const MIN_SYNC_INTERVAL = 5000; // 5 seconds

// Update UI based on product status
function updateUI(pName, status) {
    const btn = document.querySelector(`.product-button[data-name="${pName}"]`);
    if (btn) {
        if (status === "no") {
            btn.innerText = "نفذت الكمية";
            btn.disabled = true;
            btn.style.backgroundColor = "#D32F2F";
            btn.closest('.product-card').style.opacity = "0.6";
        } else {
            btn.innerText = "إضافة إلى السلة";
            btn.disabled = false;
            btn.style.backgroundColor = "";
            btn.closest('.product-card').style.opacity = "1";
        }
    }
}

// Sync menu with REST API
async function syncMenu() {
    const now = Date.now();

    if (now - lastSyncTime < MIN_SYNC_INTERVAL) {
        console.log("تخطي التحديث - تم التحديث مؤخراً");
        return;
    }

    try {
        const { data, error } = await restaurantSupabase
            .from('inventory')
            .select('product_name, status');

        if (error) throw error;

        data.forEach(item => {
            updateUI(item.product_name, item.status);
        });

        lastSyncTime = now;
        console.log("✅ تم تحديث القائمة (REST API)");
    } catch (e) {
        console.error("❌ خطأ في جلب البيانات:", e);
    }
}

// Start realtime connection
function startRealtimeConnection() {
    if (inventoryChannel) {
        console.log("⚠️ الاتصال موجود بالفعل");
        return;
    }

    try {
        inventoryChannel = restaurantSupabase
            .channel('inventory_updates')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'inventory'
            }, payload => {
                console.log("🔔 تحديث فوري:", payload.new);
                updateUI(payload.new.product_name, payload.new.status);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log("✅ اتصال Realtime نشط");
                }
            });
    } catch (e) {
        console.error("❌ خطأ في فتح الاتصال:", e);
    }
}

// Stop realtime connection
async function stopRealtimeConnection() {
    if (inventoryChannel) {
        await restaurantSupabase.removeChannel(inventoryChannel);
        inventoryChannel = null;
        console.log("🔴 تم قطع اتصال Realtime (توفير موارد)");
    }
}

// Enter idle mode
async function enterIdleMode() {
    if (isIdle) return;

    isIdle = true;
    await stopRealtimeConnection();

    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(syncMenu, SYNC_INTERVAL);

    console.log("😴 وضع الخمول - تحديثات كل 60 ثانية");
}

// Enter active mode
async function enterActiveMode() {
    if (!isIdle) return;

    isIdle = false;

    if (syncTimer) {
        clearInterval(syncTimer);
        syncTimer = null;
    }

    await syncMenu();
    startRealtimeConnection();

    console.log("⚡ وضع النشاط - تحديثات فورية");
}

// Reset idle timer
function resetIdleTimer() {
    clearTimeout(interactionTimer);

    if (isIdle) {
        enterActiveMode();
    }

    interactionTimer = setTimeout(enterIdleMode, IDLE_TIMEOUT);
}

// Monitor user activity
window.addEventListener('load', resetIdleTimer);
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('mousedown', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);
document.addEventListener('scroll', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
    if (inventoryChannel) {
        await stopRealtimeConnection();
    }
    if (syncTimer) {
        clearInterval(syncTimer);
    }
    if (interactionTimer) {
        clearTimeout(interactionTimer);
    }
});

// Monitor page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        enterIdleMode();
    } else {
        resetIdleTimer();
    }
});

// Initialize system
(async function init() {
    await syncMenu();
    startRealtimeConnection();
    resetIdleTimer();
    console.log("🚀 النظام جاهز");
})();