document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItemsContainer = document.getElementById('cart__items');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalPriceElement = document.getElementById('totalPrice');

    let totalQuantity = 0;
    let totalPrice = 0;

    // Fetch product details and display them
    const fetchProductDetails = (productId) => {
        return fetch(`http://localhost:3000/api/products/${productId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    };

    // Create and insert elements for each product in the cart
    const createCartItemElement = (product, item) => {
        const article = document.createElement('article');
        article.classList.add('cart__item');
        article.setAttribute('data-id', item.id);
        article.setAttribute('data-color', item.color);

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('cart__item__img');
        const img = document.createElement('img');
        img.src = product.imageUrl;
        img.alt = product.altTxt;
        imgDiv.appendChild(img);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('cart__item__content');

        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('cart__item__content__description');
        const title = document.createElement('h2');
        title.textContent = product.name;
        const color = document.createElement('p');
        color.textContent = item.color;
        const price = document.createElement('p');
        price.textContent = `€${product.price}`;
        descriptionDiv.appendChild(title);
        descriptionDiv.appendChild(color);
        descriptionDiv.appendChild(price);

        const settingsDiv = document.createElement('div');
        settingsDiv.classList.add('cart__item__content__settings');

        const quantityDiv = document.createElement('div');
        quantityDiv.classList.add('cart__item__content__settings__quantity');
        const quantityLabel = document.createElement('p');
        quantityLabel.textContent = 'Quantity: ';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.classList.add('itemQuantity');
        quantityInput.name = 'itemQuantity';
        quantityInput.min = '1';
        quantityInput.max = '100';
        quantityInput.value = item.quantity;
        quantityDiv.appendChild(quantityLabel);
        quantityDiv.appendChild(quantityInput);

        const deleteDiv = document.createElement('div');
        deleteDiv.classList.add('cart__item__content__settings__delete');
        const deleteText = document.createElement('p');
        deleteText.classList.add('deleteItem');
        deleteText.textContent = 'Delete';
        deleteDiv.appendChild(deleteText);

        settingsDiv.appendChild(quantityDiv);
        settingsDiv.appendChild(deleteDiv);

        contentDiv.appendChild(descriptionDiv);
        contentDiv.appendChild(settingsDiv);

        article.appendChild(imgDiv);
        article.appendChild(contentDiv);

        return article;
    };


    // Process and display cart items
    const processCartItems = async () => {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        let totalQuantity = 0;
        let totalPrice = 0;
        console.log(cart)

        for (const item of cart) {
            const product = await fetchProductDetails(item.id);

            if (product) {
                const cartItemElement = createCartItemElement(product, item);
                cartItemsContainer.appendChild(cartItemElement);

                // Update total quantity and total price
                totalQuantity += item.quantity;
                totalPrice += item.quantity * product.price;
            }
        }

        totalQuantityElement.textContent = totalQuantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);


        console.log("processCartItems")
    };

    // Update the cart in localStorage and refresh the display
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        processCartItems();
    };

    // Event listener for changes in quantity
    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('itemQuantity')) {
            const quantityInput = event.target;
            const id = quantityInput.dataset.id;
            const color = quantityInput.dataset.color;
            const newQuantity = parseInt(quantityInput.value, 10);



            // Update cart with new quantity
            cart = cart.map(item => {
                if (item.id === id && item.color === color) {
                    item.quantity = newQuantity;
                }
                return item;
            });

            updateCart();
        }

    });

    // Event listener for deleting items
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteItem')) {
            const article = event.target.closest('.cart__item');
            const id = article.dataset.id;
            const color = article.dataset.color;

            // Remove item from cart
            cart = cart.filter(item => !(item.id === id && item.color === color));

            updateCart();
        }
    });

    // Initial processing of cart items
    processCartItems();
});

