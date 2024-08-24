// console.log("data")
// fetch('http://localhost:3000/api/products')
//   .then(response => response.json())
//   .then(data => console.log(data))

// document.getElementsByClassName()
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(products => displayProducts(products))
  .catch(error => console.error('Error fetching products:', error))

/**
 * Displays products on page
 * 
 * @param {[object]} products - product info
 */
function displayProducts(products) {
  const productContainer = document.getElementById('items');

  console.log(products)
  products.forEach(product => {
    const productElement = document.createElement('a');
    productElement.href = `./product.html?id=${product._id}`;

    const productArticle = document.createElement('article');
    productElement.appendChild(productArticle);

    const productImage = document.createElement('img');
    productImage.src = product.imageUrl;
    productImage.alt = product.name;
    productArticle.appendChild(productImage);

    const productName = document.createElement('h3');
    productName.classList.add('productName');
    productName.textContent = product.name;
    productArticle.appendChild(productName);

    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.textContent = product.description;
    productArticle.appendChild(productDescription);

    // const productPrice = document.createElement('p');
    // productPrice.classList.add('productPrice');
    // productPrice.textContent = `$${product.price}`;
    // productElement.appendChild(productPrice);

    productContainer.appendChild(productElement);

  });
}
