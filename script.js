document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const cartList = document.getElementById('cart-list');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        const taxRate = 0.1; // Example tax rate of 10%

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <button data-id="${item.id}" class="remove-from-cart">Remove</button>
            `;
            cartList.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        const tax = total * taxRate;
        const grandTotal = total + tax;

        cartCount.textContent = cart.length;
        cartTotal.textContent = `$${grandTotal.toFixed(2)} (including $${tax.toFixed(2)} tax)`;

        // Add event listeners to remove buttons after updating the cart
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.image}" alt="${product.name}" width="100">
                    <p>$${product.price.toFixed(2)}</p>
                    <button data-id="${product.id}" data-price="${product.price}" data-name="${product.name}" class="add-to-cart">Add to Cart</button>
                `;
                productList.appendChild(productItem);
            });

            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function () {
                    const id = parseInt(this.getAttribute('data-id'));
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));

                    addToCart({ id, name, price });
                });
            });

            updateCart(); // Initial cart update to reflect any existing items
        })
        .catch(error => console.error('Error fetching product data:', error));
});
