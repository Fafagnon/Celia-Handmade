document.addEventListener('DOMContentLoaded', () => {
    // Le fichier index.js peut rester vide pour le moment.
    // Toute la logique partagée (panier, menu, etc.) est dans common.js.
    // On pourrait ajouter ici des animations spécifiques à la page d'accueil si besoin.
    
    // Exemple : gestion du formulaire de contact qui est sur la page d'accueil
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nom = contactForm.querySelector('[name="name"]').value;
            const email = contactForm.querySelector('[name="email"]').value;
            const msg = contactForm.querySelector('[name="message"]').value;
            
            let texteMessage = `*Nouveau message du site Celia Handmade :*\n\n*Nom :* ${nom}\n*Email :* ${email}\n\n*Message :*\n${msg}`;
            const phoneNumber = "22893122283";
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(texteMessage)}`;
            
            window.open(whatsappURL, '_blank');
            // La fonction showToast est globale grâce à common.js mais il faut s'assurer qu'elle est définie
            if(window.CeliaHandmade && typeof window.CeliaHandmade.showToast === 'function') {
                window.CeliaHandmade.showToast('Redirection vers WhatsApp...');
            }
            contactForm.reset();
        });
    }
});