const productCache = []
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


        console.log(cart)

        for (const item of cart) {
            const product = await fetchProductDetails(item.id);
            if (!productCache.some(p => p._id === product._id)) { productCache.push(product) };




            if (product) {
                const cartItemElement = createCartItemElement(product, item);
                cartItemsContainer.appendChild(cartItemElement);

                updateTotals(item.quantity, product.price);
            }
        }
    }


    console.log("processCartItems")

    const updateCartTotals = () => {
        let totalQuantity = 0;
        let totalPrice = 0;

        for (const item of cart) {
            const product = productCache.find(p => p._id === item.id);
            if (product) {
                totalQuantity += item.quantity;
                totalPrice += item.quantity * product.price;
            }
        }

        totalQuantityElement.textContent = totalQuantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    };

    // Update the cart in localStorage and refresh the display
    const updateCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        // processCartItems();
    };

    // Event listener for changes in quantity
    cartItemsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('itemQuantity')) {
            const quantityInput = event.target;
            const article = quantityInput.closest('article')
            const id = article.dataset.id;
            const color = article.dataset.color;
            const newQuantity = parseInt(quantityInput.value, 10);
            let changeQuantity;


            // Update cart with new quantity
            cart = cart.map(item => {
                if (item.id === id && item.color === color) {
                    changeQuantity = newQuantity - item.quantity
                    item.quantity = newQuantity;
                }
                return item;
            });

            updateCart();
            //FIXME update totals on page without refreshing (use new function to update total)
            //TODO update totals on page by calling a function updateCartTotals
            const product = productCache.find(p => p._id === id);
            updateTotals(changeQuantity, product.price)

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
            //TODO update totals on page by calling a function updateCartTotals
        }
    });

    //TODO 
    // Initial processing of cart items
    processCartItems();
    function updateTotals(quantity, price) {
        let totalQuantity = parseInt(totalQuantityElement.textContent || "0")
        let totalPrice = parseInt(totalPriceElement.textContent || "0")
        totalQuantity += quantity;
        totalPrice += quantity * price;
        totalQuantityElement.textContent = totalQuantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);
        // return { totalQuantity, totalPrice };
    }
});


document.getElementById('order').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission for now

    // Collect user input
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validate input
    let valid = true;

    if (!validateName(firstName)) {
        showError('firstNameErrorMsg', 'Please enter a valid first name');
        valid = false;
    } else {
        clearError('firstNameErrorMsg');
    }

    if (!validateName(lastName)) {
        showError('lastNameErrorMsg', 'Please enter a valid last name');
        valid = false;
    } else {
        clearError('lastNameErrorMsg');
    }

    if (!validateAddress(address)) {
        showError('addressErrorMsg', 'Please enter a valid address');
        valid = false;
    } else {
        clearError('addressErrorMsg');
    }

    if (!validateCity(city)) {
        showError('cityErrorMsg', 'Please enter a valid city');
        valid = false;
    } else {
        clearError('cityErrorMsg');
    }

    if (!validateEmail(email)) {
        showError('emailErrorMsg', 'Please enter a valid email address');
        valid = false;
    } else {
        clearError('emailErrorMsg');
    }

    // If all fields are valid, create a contact object and confirm the order
    if (valid) {
        const contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        };

        console.log('Order confirmed!', contact);

        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        //TODO call order function
        confirmOrder(contact, cartItems)

    }
});


// Validation functions
function validateName(name) {
    return /^[A-Za-z\s'-]{2,}$/.test(name);
}

function validateAddress(address) {
    return /^[A-Za-z0-9\s,.'-]{3,}$/.test(address);
}

function validateCity(city) {
    return /^[A-Za-z\s'-]{2,}$/.test(city);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper functions to display error messages
function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearError(elementId) {
    document.getElementById(elementId).textContent = '';
}


function confirmOrder(contact, cartItems) {

    console.log('Order ID Confimred', contact);
    const orderData = {
        contact: contact,
        products: cartItems.map(item => item.id)
    };

    console.log(orderData)

    // POST request to the API
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.orderId) {
                // Clear the cart after successful order
                localStorage.removeItem('cart');
                // Redirect to the confirmation page with the order ID
                window.location.href = `confirmation.html?orderId=${data.orderId}`;
            }
        .catch (error => console.error('Error:', error));
}
