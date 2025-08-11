// --- BASE DE DONNÉES DES PRODUITS (PARTAGÉE) ---
const products = [
    { id: '1', name: 'Ensemble en lin', category: 'femme', price: 10000, img: 'ensemble lin.jpeg', description: 'Un magnifique ensemble en lin pur, parfait pour les journées ensoleillées. Léger, respirant et incroyablement chic.' },
    { id: '2', name: 'Chemise lin', category: 'homme', price: 5000, img: 'chemise lin.webp', description: 'L\'élégance décontractée. Cette chemise en lin est un indispensable de la garde-robe masculine.' },
    { id: '3', name: 'Robe en lin', category: 'femme', price: 5000, img: 'robe lin.webp', description: 'Simple, élégante et confortable. La robe en lin parfaite pour toutes les occasions.' },
    { id: '4', name: 'Sac à main', category: 'accessoires', price: 10000, img: 'sac à main.jpeg', description: 'Un sac à main artisanal qui complètera parfaitement votre tenue. Spacieux et stylé.' },
    { id: '5', name: 'Culotte en lin', category: 'homme', price: 1500, img: 'culotte lin.webp', description: 'Confort et style avec cette culotte en lin pour homme. Idéale pour un look estival.' },
    { id: '6', name: 'Ensemble enfant en Batik', category: 'enfant', price: 10000, img: 'enfant.jpg', description: 'Un adorable ensemble en tissu Batik coloré pour les plus petits. Fait main avec amour.' },
    { id: '7', name: 'Robe en Batik', category: 'femme', price: 10500, img: 'images.jpeg', description: 'Faites sensation avec cette robe en Batik aux motifs vibrants. Une pièce unique et audacieuse.' },
    { id: '8', name: 'Chapeau Femme', category: 'accessoires', price: 5000, img: 'chapeau.jpeg', description: 'Protégez-vous du soleil avec style grâce à ce chapeau élégant, l\'accessoire parfait pour vos sorties.' }
];

// --- LOGIQUE PARTAGÉE (Panier, Modals, Notifications, etc.) ---
document.addEventListener('DOMContentLoaded', () => {

    // --- SÉLECTEURS DOM (PARTAGÉS) ---
    const cartIcon = document.getElementById('cartIcon');
    const cartContainer = document.getElementById('cart');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.querySelector('.cart-count');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutWhatsapp');
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    const backToTopBtn = document.getElementById('backToTop');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // --- PANIER ---
    let cart = JSON.parse(localStorage.getItem('celiaHandmadeCart')) || [];

    // --- FONCTIONS PARTAGÉES ---

    const updateCart = () => {
        if (!cartItemsContainer) return; // Ne rien faire si l'élément n'existe pas sur la page
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
        } else {
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return;

                total += item.quantity * product.price;
                totalItems += item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${product.name}</h4>
                        <p class="cart-item-price">${product.price.toLocaleString('fr-FR')} FCFA</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                            <span class="quantity-input">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${product.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        cartTotalEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
        cartCountEl.textContent = totalItems;
        localStorage.setItem('celiaHandmadeCart', JSON.stringify(cart));
    };

    const handleQuantityChange = (id, change) => {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        updateCart();
    };
    
    const addToCart = (id) => {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity++;
        } else {
            cart.push({ id, quantity: 1 });
        }
        showToast('Article ajouté au panier !');
        updateCart();
    };
    
    const showProductModal = (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        modalBody.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p>${product.description}</p>
                <p class="price">${product.price.toLocaleString('fr-FR')} FCFA</p>
                <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        modal.classList.add('active');
        overlay.classList.add('active');
    };
    
    const showToast = (message) => {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    };

    const toggleCart = () => {
        cartContainer.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    // --- ÉCOUTEURS D'ÉVÉNEMENTS (PARTAGÉS) ---

    // Menu mobile
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));

    // Panier
    cartIcon.addEventListener('click', () => { updateCart(); toggleCart(); });
    closeCart.addEventListener('click', toggleCart);
    overlay.addEventListener('click', () => {
        cartContainer.classList.remove('active');
        modal.classList.remove('active');
        overlay.classList.remove('active');
        navLinks.classList.remove('active');
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id || e.target.closest('[data-id]')?.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('increase')) handleQuantityChange(id, 1);
        else if (e.target.classList.contains('decrease')) handleQuantityChange(id, -1);
        else if (e.target.closest('.remove-item')) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }
    });

    clearCartBtn.addEventListener('click', () => { cart = []; updateCart(); });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) { showToast('Votre panier est vide.'); return; }
        let message = "Bonjour Celia Handmade, je souhaite commander les articles suivants :\n\n";
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const itemTotal = item.quantity * product.price;
            total += itemTotal;
            message += `*${product.name}* (x${item.quantity}) - ${itemTotal.toLocaleString('fr-FR')} FCFA\n`;
        });
        message += `\n*Total de la commande : ${total.toLocaleString('fr-FR')} FCFA*`;
        const phoneNumber = "22893122283";
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    });
    
    // Modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-modal')) {
            addToCart(e.target.dataset.id);
            modal.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    // Bouton "Retour en haut"
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    
    // Année du footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Exportation pour que les autres scripts puissent les utiliser
    window.CeliaHandmade = {
        products,
        addToCart,
        showProductModal,
        updateCart
    };
    
    // Initialisation
    updateCart();
});

// --- LOGIQUE POUR L'ANIMATION AU SCROLL ---
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionnel : arrêter d'observer l'élément une fois qu'il est visible
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1 // L'élément est considéré visible quand 10% est à l'écran
});

revealElements.forEach(el => {
    observer.observe(el);
});