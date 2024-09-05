document.addEventListener("DOMContentLoaded", () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    console.log('Product ID:', productId)
    if (productId) {
        fetch(`http://localhost:3000/api/products/${productId}`)
            .then(response => response.json())
            .then(products => displayProduct(products))
            .catch(error => console.error('Error fetching product:', error));
    }
    else {
        console.error('No product ID found in URL');
    }
});

function displayProduct(product) {
    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;

    const imgContainer = document.querySelector('.item__img');
    const productImage = document.createElement('img');
    productImage.src = product.imageUrl;
    productImage.alt = product.altTxt;
    imgContainer.appendChild(productImage);

    const colorsSelect = document.getElementById('colors');
    product.colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorsSelect.appendChild(option);
    });
}

const cartItem = { id: 123, color: "purple", quantity: 2 }
let cart = []
cart = JSON.parse(localStorage.getItem("cart"))

document.getElementById('addToCart').addEventListener('click', () => {

    //Done get the product id, select color, and quantity
    const color = document.getElementById('colors').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    //using same methd to get the product_id
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    if (!color || quantity <= 0 || quantity > 100) {
        alert('Please select a valid color and quantity.');
        return;
    }

    // create cart item
    const cartItem = {
        id: productId,
        color: color,
        quantity: quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || []; 
    console.log(cart)
    let productExists = false;

    if (cart.length === 0) {
        // 1. Cart is empty, add product to cart
        cart.push(cartItem);
    } else {
        for (let item of cart) {
            if (item.id === cartItem.id) {
                if (item.color === cartItem.color) {
                    // 4. Cart has the product with the same color, increase quantity
                    item.quantity += cartItem.quantity;
                    productExists = true;
                    break;
                }
            }
        }

        if (!productExists) {
            // 2 Cart does not have the product at all,
            // 3 if cart is not empty does have product but it a different color then add product to cart
            cart.push(cartItem);
            productExists = true;
        }

    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart successfully!');

    const updatedCart = JSON.parse(localStorage.getItem('cart'));
    console.log("Updated Cart:", updatedCart);
});
