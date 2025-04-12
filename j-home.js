/**
 * Oriyat Mebel - Frontend JavaScript
 * 
 * This file handles all client-side functionality for the furniture website
 * including product loading, filtering, mobile menu, and form submission.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Load products
    loadProducts();
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter products
            filterProducts(category);
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to your backend
            console.log('Form submitted with values:', formValues);
            
            // Show success message
            alert('Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
                
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * Fetches products from the API and renders them in the products grid
 */
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // Store all products in a global variable for filtering
        window.allProducts = products;
        
        // Render products
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        
        // Show error message
        productsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Mahsulotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.</p>
            </div>
        `;
        
        // Load fallback products for demo purposes
        loadFallbackProducts();
    }
}

/**
 * Renders products in the products grid
 * @param {Array} products - Array of product objects
 */
function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>Mahsulotlar topilmadi.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category || ''}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price} so'm</div>
            </div>
        </div>
    `).join('');
}

/**
 * Filters products by category
 * @param {string} category - Category to filter by
 */
function filterProducts(category) {
    if (!window.allProducts) return;
    
    let filteredProducts;
    
    if (category === 'all') {
        filteredProducts = window.allProducts;
    } else {
        filteredProducts = window.allProducts.filter(product => 
            product.category === category
        );
    }
    
    renderProducts(filteredProducts);
}

/**
 * Loads fallback products for demo purposes when API fails
 */
function loadFallbackProducts() {
    const fallbackProducts = [
        {
            name: "Zamonaviy divan",
            description: "Yumshoq va qulay divan, turli xil ranglarda mavjud",
            price: "3,500,000",
            image_url: "https://source.unsplash.com/random/300x250/?sofa",
            category: "livingroom"
        },
        {
            name: "Yotoq krovati",
            description: "Qulay va chiroyli yotoq krovati, turli o'lchamlarda",
            price: "4,200,000",
            image_url: "https://source.unsplash.com/random/300x250/?bed",
            category: "bedroom"
        },
        {
            name: "Kiyim shkafi",
            description: "Keng va qulay kiyim shkafi, ko'p funksiyali",
            price: "5,800,000",
            image_url: "https://source.unsplash.com/random/300x250/?wardrobe",
            category: "bedroom"
        },
        {
            name: "Oshxona stoli",
            description: "Zamonaviy oshxona stoli, mustahkam va chiroyli",
            price: "2,900,000",
            image_url: "https://source.unsplash.com/random/300x250/?dining-table",
            category: "kitchen"
        },
        {
            name: "Oshxona stullari",
            description: "Qulay va chiroyli oshxona stullari, to'plam",
            price: "1,800,000",
            image_url: "https://source.unsplash.com/random/300x250/?chair",
            category: "kitchen"
        },
        {
            name: "Kitob javoni",
            description: "Keng va qulay kitob javoni, turli o'lchamlarda",
            price: "2,500,000",
            image_url: "https://source.unsplash.com/random/300x250/?bookshelf",
            category: "office"
        }
    ];
    
    // Store in global variable for filtering
    window.allProducts = fallbackProducts;
    
    // Render fallback products
    renderProducts(fallbackProducts);
}