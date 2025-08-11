document.addEventListener('DOMContentLoaded', () => {

    // On récupère les fonctions et données partagées depuis l'objet global
    const { products, addToCart, showProductModal } = window.CeliaHandmade;

    // --- SÉLECTEURS DOM (SPÉCIFIQUES À CETTE PAGE) ---
    const productGrid = document.getElementById('productGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput'); // Le nouvel input de recherche

    // --- FONCTIONS ---

    /**
     * Crée les cartes HTML pour chaque produit et les insère dans la grille.
     * Cette fonction n'a pas changé.
     */
    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>Aucun produit ne correspond à vos critères.</p>';
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

    /**
     * NOUVELLE FONCTION CENTRALE :
     * C'est elle qui gère l'affichage en fonction des filtres ET de la recherche.
     */
    const updateDisplayedProducts = () => {
        // 1. On trouve quel bouton de catégorie est actif
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        
        // 2. On récupère le texte de la barre de recherche
        const searchTerm = searchInput.value.toLowerCase().trim();

        // 3. On filtre la liste de produits
        let displayedProducts = products;

        // Étape A : Filtrer par catégorie
        if (activeCategory !== 'all') {
            displayedProducts = displayedProducts.filter(p => p.category === activeCategory);
        }

        // Étape B : Filtrer par recherche (sur les résultats de l'étape A)
        if (searchTerm) {
            displayedProducts = displayedProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        // 4. On affiche le résultat final
        renderProducts(displayedProducts);
    };
    
    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---

    // Quand on clique sur un bouton de filtre
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // On met à jour le bouton actif
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            
            // On appelle la fonction centrale pour mettre à jour l'affichage
            updateDisplayedProducts();
        });
    });

    // Quand on tape dans la barre de recherche
    searchInput.addEventListener('input', () => {
        // On appelle la même fonction centrale pour mettre à jour l'affichage
        updateDisplayedProducts();
    });

    // Délégation d'événements pour les clics sur les produits (inchangé)
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e.target.dataset.id);
        } else if (e.target.closest('.product-img-container')) {
            showProductModal(e.target.closest('.product-img-container').dataset.id);
        }
    });

    // --- INITIALISATION DE LA PAGE ---
    
    // Lire la catégorie depuis l'URL (pour les liens depuis la page d'accueil)
    const getCategoryFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('category');
    };

    // Activer le bon filtre au chargement
    const initialCategory = getCategoryFromURL() || 'all';
    const initialActiveBtn = document.querySelector(`.filter-btn[data-category="${initialCategory}"]`);
    if (initialActiveBtn) {
        initialActiveBtn.classList.add('active');
    } else {
        // Sécurité : si la catégorie dans l'URL n'existe pas, on active "Tous"
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
    }

    // Afficher les produits une première fois au chargement de la page
    updateDisplayedProducts();
});