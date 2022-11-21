var userCart = [];
var cartTotal = 0;

// fetch product data
window.onload = () => loadProductData();
async function loadProductData() {
   var productDataURL = "./json/data.json";
   var response = await fetch(productDataURL);
   var data = await response.json();

   createProductCards(data);
   updateDynamicModal(data);
   addToCart(data);
   filterItems(data);
}

// create cards with product data
function createProductCards(data) {
   var products = data.products;

   for (i = 0; i < products.length; i++) {
      var productTitle = products[i].title;
      var productAuthor = products[i].author;
      var productPrice = products[i].price;
      var productFormat = products[i].format;
      var productImageURL = products[i].image_URL;
      var priceFormat = `$${parseFloat(productPrice).toFixed(2)}`;

      createAppendElements();
      function createAppendElements() {
         // create elements and append

         var cardsContainer = document.querySelector(".cards-container");
         // card
         var card = document.createElement("div");
         card.className = "card";
         cardsContainer.appendChild(card);
         card.setAttribute("data-ID", productTitle);
         card.setAttribute("data-format", productFormat);

         // image container
         var imageContainer = document.createElement("div");
         imageContainer.className = "image-container";
         card.appendChild(imageContainer);

         // image
         var image = document.createElement("img");
         imageContainer.appendChild(image);
         image.src = productImageURL;

         // main
         var main = document.createElement("main");
         card.appendChild(main);

         // product name
         var productTitleText = document.createElement("h2");
         main.appendChild(productTitleText);
         productTitleText.textContent = productTitle;

         // author
         var productAuthorText = document.createElement("span");
         productAuthorText.className = "author";
         main.appendChild(productAuthorText);
         productAuthorText.textContent = productAuthor;

         // format
         var productFormatText = document.createElement("span");
         productFormatText.className = "format";
         main.appendChild(productFormatText);
         productFormatText.textContent = productFormat;

         // details button
         var detailsButton = document.createElement("div");
         main.appendChild(detailsButton);
         detailsButton.className = "details-button";

         // details button text
         var detailsButtonText = document.createElement("span");
         detailsButton.appendChild(detailsButtonText);
         detailsButtonText.textContent = "Details";

         // footer
         var cardFooter = document.createElement("footer");
         card.appendChild(cardFooter);

         //price
         var price = document.createElement("span");
         cardFooter.appendChild(price);
         price.textContent = priceFormat;

         //add to cart button
         var addToCartButton = document.createElement("div");
         cardFooter.appendChild(addToCartButton);
         addToCartButton.className = "addtocart-button";

         //button text
         var buttonText = document.createElement("span");
         addToCartButton.appendChild(buttonText);
         buttonText.textContent = "Add to cart";

         // add to cart icon
         var addToCartIcon = document.createElement("img");
         addToCartButton.appendChild(addToCartIcon);
         addToCartIcon.className = "addtocart-icon";
         addToCartIcon.src = "./images/icons/cart.svg";
      }
   }
}

// ---------- product modal
function updateDynamicModal(data) {
   var productCards = document.querySelectorAll(".card .details-button");
   for (var item of productCards) {
      item.addEventListener("click", (event) => {
         var productID = event.target.closest(".card").getAttribute("data-ID");
         var products = data.products;

         console.log(productID);
         for (var product of products) {
            var productName = product.title;

            if (productID == productName) {
               showProductModal(product);
            }
         }
      });
   }
}

// show product modal
function showProductModal(modalData) {
   var productModal = document.querySelector(".product-modal");
   var productModalImage = productModal.querySelector(".image");
   var title = productModal.querySelector(".title");
   var author = productModal.querySelector(".author");
   var date = productModal.querySelector(".date");
   var pages = productModal.querySelector(".pages");
   var isbn = productModal.querySelector(".isbn");
   var description = productModal.querySelector(".description");

   productModalImage.src = modalData.image_URL;
   title.textContent = modalData.title;
   author.textContent = `Author: ${modalData.author}`;
   date.textContent = `Date: ${modalData.date}`;
   pages.textContent = `Pages: ${modalData.pages}`;
   isbn.textContent = `isbn: ${modalData.isbn}`;
   description.textContent = modalData.description;

   document.body.classList.add("unscrollable");
   productModal.showModal();

   var closeModalButton = productModal.querySelector(".close-modal-button");
   closeModalButton.addEventListener("click", () => {
      productModal.close();
      document.body.classList.remove("unscrollable");
   });

   window.addEventListener("click", (event) => {
      if (event.target == productModal && productModal.open) {
         productModal.close();
         document.body.classList.remove("unscrollable");
      }
   });
}

function addToCart(data) {
   var addToCartButtons = document.querySelectorAll(".addtocart-button");
   for (var button of addToCartButtons) {
      button.addEventListener("click", (event) => {
         var product = event.target.closest(".card");
         var productID = product.getAttribute("data-ID");

         for (var item of data.products) {
            if (productID == item.title) {
               var newCartItem = {};
               var priceFormat = parseFloat(item.price);

               newCartItem.Item = item.title;
               newCartItem.Price = priceFormat;
               newCartItem.Image_URL = item.image_URL;

               userCart.push(newCartItem);
               cartTotal += priceFormat;
            }
         }

         showAddToCartPopup();
         updateCart();
         calculateCartTotal();
         console.table(userCart);
      });
   }
}

function updateCart() {
   var cartIconCounter = document.querySelector(".cart-icon-container span");
   cartIconCounter.textContent = userCart.length;
}

function calculateCartTotal() {
   cartTotal = 0;

   for (i = 0; i < userCart.length; i++) {
      cartTotal += userCart[i].Price;
   }
   console.log(cartTotal);
}

function showAddToCartPopup() {
   var addToCartModal = document.querySelector(".addtocart-popup-modal");

   addToCartModal.showModal();
   setTimeout(() => {
      addToCartModal.close();
   }, 1000);
}

var showCartBtn = document.querySelector(".cart-icon-container");
var cart = document.querySelector(".user-cart");

function filterItems(data) {
   var filterBtn = document.querySelectorAll('input[type="radio"]');
   console.log(filterBtn);
   var cards = document.querySelectorAll(".card");
   for (var button of filterBtn) {
      button.addEventListener("click", (event) => {
         for (var card of cards) {
            if (card.getAttribute("data-format").includes(event.target.value)) {
               card.style.display = "flex";
            } else if (event.target.value == "All") {
               card.style.display = "flex";
            } else {
               card.style.display = "none";
            }
         }

         // for (var card of cards) {
         //    if (card.getAttribute("data-format") == event.target.value || card.getAttribute("data-format") == "Paperback / eBook") {
         //       card.style.display = "flex";
         //    } else if (event.target.value == "All") {
         //       card.style.display = "flex";
         //    } else {
         //       card.style.display = "none";
         //    }
         // }
      });
   }
}

showCartBtn.addEventListener("click", (event) => {
   showCart();
   document.body.classList.add("unscrollable");
});

window.addEventListener("click", (event) => {
   if (event.target == cart) {
      cart.close();
      document.body.classList.remove("unscrollable");
   }
});

function showCart() {
   cart.showModal();
   updateCartItems(true);
}

function hideCart() {
   updateCartItems(false);
   cart.close();
}

function updateCartItems(param1) {
   var cartItemContainer = document.querySelector(".user-cart .order-container");

   for (var item of userCart) {
      if (param1 == true) {
         // cart item container
         var cartItem = document.createElement("div");
         cartItem.className = "product-order";
         cartItemContainer.appendChild(cartItem);

         // left container
         var leftContainer = document.createElement("div");
         leftContainer.className = "left-container";
         cartItem.appendChild(leftContainer);

         // item title
         var itemTitle = document.createElement("span");
         itemTitle.className = "title";
         leftContainer.appendChild(itemTitle);

         // item author
         var itemAuthor = document.createElement("span");
         itemAuthor.className = "author";
         leftContainer.appendChild(itemAuthor);

         // Right container
         var rightContainer = document.createElement("div");
         rightContainer.className = "right-container";
         cartItem.appendChild(rightContainer);

         // item price
         var itemPrice = document.createElement("span");
         itemPrice.className = "price";
         rightContainer.appendChild(itemPrice);

         // remove button
         var removeButton = document.createElement("span");
         removeButton.className = "remove-button";
         rightContainer.appendChild(removeButton);
         removeButton.textContent = "remove";
      }
   }
}
