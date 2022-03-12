// store functions

function renderStoreItems() {
  products.forEach(function (product) {
    let id = product.id;
    let imageFront = product.imageFront;
    let name = product.name;
    let price = product.price;
    let item =
      $(`<div id="store__item-${id}" class="store__item card text-center" style="width: 15rem; margin: clamp(5px, 1%, 10px); ">
      <img class="card-img-top" src=${imageFront} alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <h5 class="card-title">${price}$</h5>
        <button class="store__add-btn btn btn-primary">Agregar al carrito</button>
      </div>
      </div>`);
    $("#store__container").append(item);
  });
  addEventListenerToAddButtons();
}

function addEventListenerToAddButtons() {
  $(".store__add-btn").click(function () {
    let id = $(this).parent().parent().attr("id").split("-")[1];
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

// cart functions


function renderCartItem(product) {
  let id = product.id;
  let imageFront = product.imageFront;
  let name = product.name;
  let price = product.price;
  let quantity = product.selected;
  let item = $(`
  <div id="cart__item-${id}" class="cart__item">
    <img class="cart__item-img " src=${imageFront} alt="aqui va una imagen">
    <div class="cart__item-body container-fluid">
      <div class="row align-items-center h-100">
        <div class="col-7 col-sm-8">
          <div class="row align-items-center">
            <div class="col-12 col-sm-6">
              <label class="cart__item-name">${name} </label>
            </div>
            <div class="col-12 col-sm-6">
              <div class="cart__item-qty-container">
                  <button class="cart__minus-btn cart__qty-btn" id="cart__minus-btn-${id}"><i class="bi bi-dash-circle"></i></button>
                  <input class="cart__item-quantity" id="cart__item-quantity-${id}" type="number" inputmode="numeric" pattern="[0-9]*" value="${product.selected}">
                  <button class="cart__qty-btn cart__plus-btn" id="cart__plus-btn-${id}"><i class="bi bi-plus-circle"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 col-sm-4 d-flex flex-column">
          <label class="cart__item-price" id="cart__item-price-${id}">${quantity}x${price}$:</label>
          <label class="cart__item-total-price" id="cart__item-total-price-${id}">${price * quantity}$</label>
        </div>
      </div>
    </div>
    <button class="cart__remove-btn" id="cart__remove-btn-${id}"><i class="bi bi-trash"></i></button>
  </div>`);
  $("#cart__container").append(item);
  addEventListenerToQuantityInput(id);
  addEventListenerToPlusButton(id);
  addEventListenerToMinusButton(id);
  addEventListenerToRemoveProductButton(id);
}

function increaseProduct(id){
  let product = cart.find((item) => item.id == id);
  product.selected++;
  let quantity = product.selected;
  let price = product.price;
  updateLocalStorage("cart", cart);
  updateItemQuantity(id, quantity);
  updateItemPrice(id, price, quantity);
  updateTotalPriceText();
  updateNavCartCounter();
}

function decreaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected--;
  let quantity = product.selected;
  let price = product.price;
  if (quantity == 0) {
    removeProductFromCart(product);
  } else {
    updateItemQuantity(id, quantity);
    updateItemPrice(id, price, quantity);
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
    let quantity = product.selected;
    let price = product.price;
    let inputValue = parseInt($(`#cart__item-quantity-${id}`).val());
    if (inputValue == 0) {
      removeProductFromCart(product);
    } else if (inputValue < 0 || isNaN(inputValue) == true) {
      // TODO add popover saying wrong value or block input for only 0/1-99.. numbers
      updateItemQuantity(id, quantity);
      updateItemPrice(id, price, quantity);
    } else {
      quantity = inputValue;
      updateItemQuantity(id, quantity);
      updateItemPrice(id, price, quantity);
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

function removeAllProducts() {
  cart.forEach((product) => {
    deleteCartItem(product.id);
    product.selected = 0;
  });
  cart.splice(0, cart.length);
  updateLocalStorage("cart", cart);
}

function emptyCart() {
  removeAllProducts();
  toggleCartBuyButton();
  toggleRemoveAllProductsButton();
  toggleIsEmptyText();
  toggleShowNavCartBadge();
  updateNavCartCounter();
  updateTotalPriceText();
}

function buyCart() {
  emptyCart();
  Swal.fire({
    title: 'Thanks for buying at The Store!',
    icon: 'success',
    confirmButtonText: 'Continue'
  });
}

function toggleCartBuyButton() {
  if ($("#cart__buy-btn").hasClass("disabled")) {
    $("#cart__buy-btn").removeClass("disabled");
  } else {
    $("#cart__buy-btn").addClass("disabled");
  }
  if (cart.length == 0) {
    $("#cart__buy-btn").off("click", buyCart);
  } else {
    $("#cart__buy-btn").on("click", buyCart);
  }
}

function toggleRemoveAllProductsButton() {
  if ($("#cart__remove-all-btn").hasClass("disabled")) {
    $("#cart__remove-all-btn").removeClass("disabled");
  } else {
    $("#cart__remove-all-btn").addClass("disabled");
  }
  if (cart.length == 0) {
    $("#cart__remove-all-btn").off("click", emptyCart);
  } else {
    $("#cart__remove-all-btn").on("click", emptyCart);
  }
}

function toggleIsEmptyText() {
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

// nav functions

function updateNavCartCounter() {
  let totalQuantity = 0;
  cart.forEach((product) => {
    totalQuantity += product.selected;
  });
  if (totalQuantity > 9) {
    totalQuantity = "9+";
  }
  $("#nav__cart-counter").text(totalQuantity);
}

function addEventListenerToNavCartButton() {
  $("#nav__cart-btn").click(function () {
    $("#cart").slideToggle("550");
  });
}

function addEventListenerToNavCartCloseButton() {
  $("#cart__close-btn").click(function () {
    $("#cart").slideToggle("550");
  });
}

function toggleShowNavCartBadge() {
  if ($("#nav__cart-badge").css("opacity") == 1) {
    $("#nav__cart-badge").animate({
        opacity: 0,
      },
      500
    );
  } else {
    $("#nav__cart-badge").animate({
        opacity: 1,
      },
      500
    );
  }
}

// category selection functions

function addEventListenerToStoreButtons() {
  $(".store__category, .store__color").click(function () {
    let parameterType = $(this).attr("id").split("-")[0].split("__")[1]; //obtengo el tipo de parametro ("color" or "category")
    let parameter = $(this).attr("id").split("-")[1]; //obtengo el valor del parametro, por ejemplo "red" o "shirt"
    updateLocalStorage(`${parameterType}`, parameter);
    $(`.store__${parameterType}`).removeClass("disabled active-category");
    $(`#store__${parameterType}-${parameter}`).addClass("disabled active-category");
    let category = JSON.parse(localStorage.getItem("category"));
    let color = JSON.parse(localStorage.getItem("color"));
    filterStoreItems(category, color);
  });
}

function filterStoreItems(category, color) {
  products.forEach((product) => {
    if ((category == product.category || category == "all" ) && (product.color == color || color == "all")) {
      showItem(product.id);
    } else {
      hideItem(product.id);
    }
  });
}


function showItem(id) {
  $(`#store__item-${id}`).show();
}

function hideItem(id) {
  $(`#store__item-${id}`).hide();
}

// General

function updateLocalStorage(keyName, keyValue) {
  localStorage.setItem(keyName, JSON.stringify(keyValue));
}

function pushProductsfromJson(data) {
  data.forEach(jsonitem => {
    products.push(
      new Product(
        jsonitem.id,
        jsonitem.title,
        jsonitem.price,
        jsonitem.category,
        jsonitem.color,
        jsonitem.imageFront,
        jsonitem.imageBack
      )
    );
  });
}

// Main

class Product {
  constructor(id, name, price, category, color, imageFront, imageBack) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.color = color;
    this.imageFront = imageFront;
    this.imageBack = imageBack;
    this.selected = 0;
  }
}

updateLocalStorage("category", "all");
updateLocalStorage("color", "all");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const products = [];

$(document).ready(function () {
  if (cart.length > 0) {
    loadLocalStorageCart();
  }
  addEventListenerToNavCartButton();
  addEventListenerToNavCartCloseButton();
  if (window.location.pathname == "/pages/register/" ||
    window.location.pathname == "/pages/login/" ||
    window.location.pathname == "/pages/contact/") {
    // it doesnt get the products from the json and it doesnt load the store items.
  } else {
    $.when(
      $.getJSON("/json/1-hoodies.json"),
      $.getJSON("/json/2-sweaters.json"),
      $.getJSON("/json/3-shirts.json"),
    ).done(function (hoodiesData, sweatersData, shirtsData) {
      pushProductsfromJson(hoodiesData[0]);
      pushProductsfromJson(sweatersData[0]);
      pushProductsfromJson(shirtsData[0]);
      renderStoreItems();
      addEventListenerToStoreButtons();
    });
  }
});