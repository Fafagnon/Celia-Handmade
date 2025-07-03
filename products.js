document.addEventListener('DOMContentLoaded', () => {

    // On récupère les fonctions et données partagées depuis l'objet global
    const { products, addToCart, showProductModal } = window.CeliaHandmade;

    // --- SÉLECTEURS DOM (SPÉCIFIQUES À CETTE PAGE) ---
    const productGrid = document.getElementById('productGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // --- FONCTIONS SPÉCIFIQUES ---

    // Afficher les produits
    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>Aucun produit ne correspond à votre recherche.</p>';
            return;
        }
        productsToRender.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.style.animationDelay = `${index * 0.05}s`;
            
            productCard.innerHTML = `
                <div class="product-img-container" data-id="${product.id}">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <div>
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">${product.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    };
    
    // Fonction pour lire le paramètre de l'URL
    const getCategoryFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('category');
    };

    // --- ÉCOUTEURS D'ÉVÉNEMENTS (SPÉCIFIQUES) ---

    // Filtrage des produits
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Mettre à jour l'URL sans recharger la page (optionnel mais propre)
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);

            // Appliquer le filtre
            applyFilter(category);
        });
    });

    const applyFilter = (category) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
        renderProducts(filteredProducts);
    }

    // Délégation d'événements pour les produits
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e.target.dataset.id);
        } else if (e.target.closest('.product-img-container')) {
            showProductModal(e.target.closest('.product-img-container').dataset.id);
        }
    });

    // --- INITIALISATION DE LA PAGE ---
    const initialCategory = getCategoryFromURL() || 'all';
    applyFilter(initialCategory);
});