

// Store

function renderStoreItems() {
  products.forEach(function (product) {
    let item =
      $(`<div class="store__item card text-center" style="width: 18rem; margin: clamp(5px, 1%, 10px); ">
      <img class="card-img-top" src=${product.image} alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <h5 class="card-title">${product.price}$</h5>
        <button id="store__add-btn-${product.id}" class="store__add-btn btn btn-primary">Agregar al carrito</button>
      </div>
      </div>`);
    $("#store__container").append(item);
  });
  addEventListenerToAddButtons();
}

function addEventListenerToAddButtons() {
  $(".store__add-btn").click(function () {
    let id = $(this).attr("id").split("-")[2];
    if (cart.find((item) => item.id == id)) {
      increaseProduct(id);
    } else {
      addProductToCart(id);
    }
  });
}

function addProductToCart(id) {
  let product = products.find((item) => item.id == id);
  cart.push(product);
  increaseProduct(id);
  updateLocalStorage("cart", cart);
  renderCartItem(product);
  updateNavCartCounter();
  if (cart.length == 1) {
    toggleCartBuyButton();
    toggleRemoveAllProductsButton();
    toggleIsEmptyText();
    toggleShowNavCartBadge();
  }
  updateTotalPriceText();
}

// Cart


function renderCartItem(product) {
  let item = $(`
  <div id="cart__item-${product.id}" class="cart__item">
    <img class="cart__item-img " src=${product.image} alt="aqui va una imagen">
    <div class="cart__item-body container-fluid">
      <div class="row align-items-center h-100">
        <div class="col-7 col-sm-8">
          <div class="row align-items-center">
            <div class="col-12 col-sm-6">
              <label class="cart__item-name">${product.name} </label>
            </div>
            <div class="col-12 col-sm-6">
              <div class="cart__item-qty-container">
                  <button class="cart__minus-btn cart__qty-btn" id="cart__minus-btn-${ product.id}"><i class="bi bi-dash-circle"></i></button>
                  <input class="cart__item-quantity" id="cart__item-quantity-${product.id}" type="number" inputmode="numeric" pattern="[0-9]*" value="${product.selected}">
                  <button class="cart__qty-btn cart__plus-btn" id="cart__plus-btn-${product.id}"><i class="bi bi-plus-circle"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 col-sm-4 d-flex flex-column">
          <label class="cart__item-price" id="cart__item-price-${product.id}">${product.selected}x${product.price}$:</label>
          <label class="cart__item-total-price" id="cart__item-total-price-${product.id}">${product.price * product.selected}$</label>
        </div>
      </div>
    </div>
    <button class="cart__remove-btn" id="cart__remove-btn-${product.id}"><i class="bi bi-trash"></i></button>
  </div>`
  );
  $("#cart__container").append(item);
  addEventListenerToQuantityInput(product.id);
  addEventListenerToPlusButton(product.id);
  addEventListenerToMinusButton(product.id);
  addEventListenerToRemoveProductButton(product.id);
}

function increaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected++;
  updateLocalStorage("cart", cart);
  updateItemQuantity(product.id, product.selected);
  updateItemPrice(product.id, product.price,  product.selected);
  updateTotalPriceText();
  updateNavCartCounter();
}

function decreaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected--;
  if (product.selected == 0) {
    removeProductFromCart(product);
  } else {
    updateItemQuantity(product.id, product.selected);
    updateItemPrice(product.id, product.price,  product.selected);
    updateLocalStorage("cart", cart);
    updateTotalPriceText();
    updateNavCartCounter();
  }
}

function removeProductFromCart(product) {
  const index = cart.indexOf(product);
  if (product.selected > 0) {
    product.selected = 0; 
  }
  if (index > -1) {
    cart.splice(index, 1); //removes the index
  }
  if (cart.length == 0) {
    toggleCartBuyButton();
    toggleRemoveAllProductsButton();
    toggleIsEmptyText();
    toggleShowNavCartBadge();
  }
  deleteCartItem(product.id);
  updateNavCartCounter();
  updateLocalStorage("cart", cart);
  updateTotalPriceText();
}
function deleteCartItem(id) {
  $(`#cart__item-${id}`).slideUp(500, function () {
    $(`#cart__item-${id}`).remove();
  });
}

function updateItemQuantity(id, quantity) {
  $(`#cart__item-quantity-${id}`).val(quantity);
}
function updateItemPrice(id, price, quantity) {

  $(`#cart__item-price-${id}`).text(`${quantity}x${price}$:`);
  $(`#cart__item-total-price-${id}`).text(`${price * quantity}$`);
}

function updateTotalPriceText() {
  let totalPrice = 0;
  cart.forEach((product) => {
    totalPrice += product.price * product.selected;
  });

  if (totalPrice == 0) {
    $("#cart__total-price").text("");
  } else {
    $("#cart__total-price").text(`Total: ${totalPrice}$`);
  }
}

function addEventListenerToQuantityInput(id) {
  $(`#cart__item-quantity-${id}`).change(function () {
    let product = cart.find((item) => item.id == id);
    let quantity = parseInt($(`#cart__item-quantity-${id}`).val());
    if (quantity == 0) {
      removeProductFromCart(product);
    } else if (quantity < 0 || isNaN(quantity)==true) {
      // TODO add popover saying wrong value or block input for only 0/1-99.. numbers
      updateItemQuantity(product.id, product.selected);
      updateItemPrice(product.id, product.price,  product.selected);
    } else {
      product.selected = quantity;
      updateItemQuantity(product.id, product.selected);
      updateItemPrice(product.id, product.price,  product.selected);
      updateNavCartCounter()
      updateLocalStorage("cart", cart);
      updateTotalPriceText();
    }
  });
}

function addEventListenerToPlusButton(id) {
  $(`#cart__plus-btn-${id}`).click(function () {
    increaseProduct(id);
  });
}

function addEventListenerToMinusButton(id) {
  $(`#cart__minus-btn-${id}`).click(function () {
    decreaseProduct(id);
  });
}



function addEventListenerToRemoveProductButton(id) {
  $(`#cart__remove-btn-${id}`).click(function () {
    let product = cart.find((item) => item.id == id);
    removeProductFromCart(product);
  });
}



function removeAllProducts(){
  cart.forEach((product) => {
    deleteCartItem(product.id);
    product.selected = 0;
  });
  cart.splice(0, cart.length); //cleans the array.
  updateLocalStorage("cart", cart);
}

function buyCart() {
  removeAllProducts();
  toggleCartBuyButton()
  toggleRemoveAllProductsButton()
  toggleIsEmptyText()
  toggleShowNavCartBadge();
  updateNavCartCounter();
  updateTotalPriceText();
  Swal.fire({
    title: 'Thanks for buying at The Store!',
    icon: 'success',
    confirmButtonText: 'Continue'
  })
  
}

function toggleCartBuyButton() {
  if ($("#cart__buy-btn").hasClass("disabled")) {
    $("#cart__buy-btn").removeClass("disabled");
  } else {
    $("#cart__buy-btn").addClass("disabled");
  }
  if (cart.length == 0) {
    $("#cart__buy-btn").off("click", buyCart);
  }
  else {
    $("#cart__buy-btn").on("click", buyCart);
  }
}
function toggleRemoveAllProductsButton() {
  if ($("#cart__remove-all-btn").hasClass("disabled")) {
    $("#cart__remove-all-btn").removeClass("disabled");
  } else {
    $("#cart__remove-all-btn").addClass("disabled");
  }
}
function toggleIsEmptyText(){
  $("#cart__is-empty").slideToggle(500);
}

function loadLocalStorageCart() {
  cart.forEach((product) => {
    renderCartItem(product);
  });
  toggleCartBuyButton();
  toggleRemoveAllProductsButton();
  toggleIsEmptyText();
  toggleShowNavCartBadge();
  updateNavCartCounter();
  updateTotalPriceText();
}

// Nav

function updateNavCartCounter() {
  let totalQuantity = 0;
  cart.forEach((product) => {
    totalQuantity += product.selected;
  });
  $("#nav__cart-counter").text(totalQuantity);
}

function addEventListenerToNavCartButton() {
  $("#nav__cart-btn").click(function () {
    $("#cart").slideToggle("550");
  });
}

function toggleShowNavCartBadge() {
  if ($("#nav__cart-badge").css("opacity") == 1) {
    $("#nav__cart-badge").animate(
      {
        opacity: 0,
      },
      500
    );
  } else {
    $("#nav__cart-badge").animate(
      {
        opacity: 1,
      },
      500
    );
  }
}

// General

function updateLocalStorage(keyName, keyValue) {
  localStorage.setItem(keyName, JSON.stringify(keyValue));
}

// Main

class Product {
  constructor(id, name, price, image, description, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.category = category;
    this.selected = 0;
  }
}

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const products = [];

$(document).ready(function () {
  if (cart.length > 0) {
    loadLocalStorageCart();
  }
  addEventListenerToNavCartButton();
  if (window.location.pathname == "/pages/register/" ||
   window.location.pathname == "/pages/login/" || 
   window.location.pathname == "/pages/contact/"){
     // it doesnt get the products from the json and doesnt load the store items.
  }
  else {
    /*
    $.getJSON("json/products.json", function (data) {
      data.forEach(function (jsonitem) {
        products.push(
          new Product(
            jsonitem.id,
            jsonitem.name,
            jsonitem.price,
            jsonitem.image,
            jsonitem.description,
            jsonitem.category
          )
        );
      });
      renderStoreItems();
    });
    */
    $.getJSON("https://fakestoreapi.com/products", function (data) {
      data.forEach(function (jsonitem) {
        products.push(
          new Product(
            jsonitem.id,
            jsonitem.title,
            jsonitem.price,
            jsonitem.image,
            jsonitem.description,
            jsonitem.category
          )
        );
      });
      renderStoreItems();
    });
  }

});
