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

//TODO add click event listner to the cart button 
//TODO get the product id, select color, and quantity
const cartItem = { id: 123, color: "purple", quantity: 2 }
//TODO add a cart to local storage 
//  1 if cart is empty add product to cart
//  2 if cart is not empty does not have product then add product to cart
//  3 if cart is not empty does have product but it a different color then add product to cart
//  4 if cart is not empty has the product with the same color then increase quantity
let cart = [1, 2, 3, 4]
localStorage.setItem("cart", JSON.stringify(cart))
cart = JSON.parse(localStorage.getItem("cart"))
console.log(cart[0])

