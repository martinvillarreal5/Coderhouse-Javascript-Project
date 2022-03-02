// store functions

function renderStoreItems() {
  products.forEach(function (product) {
    let item =
      $(`<div id="store__item-${product.id}" class="store__item card text-center" style="width: 15rem; margin: clamp(5px, 1%, 10px); ">
      <img class="card-img-top" src=${product.imageFront} alt="Card image cap">
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

// cart functions


function renderCartItem(product) {
  let item = $(`
  <div id="cart__item-${product.id}" class="cart__item">
    <img class="cart__item-img " src=${product.imageFront} alt="aqui va una imagen">
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
  </div>`);
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
  updateItemPrice(product.id, product.price, product.selected);
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
    updateItemPrice(product.id, product.price, product.selected);
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
    } else if (quantity < 0 || isNaN(quantity) == true) {
      // TODO add popover saying wrong value or block input for only 0/1-99.. numbers
      updateItemQuantity(product.id, product.selected);
      updateItemPrice(product.id, product.price, product.selected);
    } else {
      product.selected = quantity;
      updateItemQuantity(product.id, product.selected);
      updateItemPrice(product.id, product.price, product.selected);
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
  $(".store__category").click(function () {
    let category = $(this).attr("id").split("-")[1];
    updateLocalStorage("category", category);
    $(".store__category").removeClass("disabled active-category");
    $(`#store__category-${category}`).addClass("disabled active-category");
    let color = JSON.parse(localStorage.getItem("color"));
    if (category == "all") {
      if (color != "all") {
        filterByColor(color);
      } else {
        $(".store__item").show();
      }
    } else {
      if (color == "all") {
        filterByCategory(category);
      } else {
        filterByCategoryAndColor(category, color);
      }
    }
  });
  $(".store__color").click(function () {
    let color = $(this).attr("id").split("-")[1];
    updateLocalStorage("color", color);
    $(".store__color").removeClass("disabled active-category");
    $(`#store__color-${color}`).addClass("disabled active-category");
    let category = JSON.parse(localStorage.getItem("category"));
    if (color == "all") {
      if (category != "all") {
        filterByCategory(category);
      } else {
        $(".store__item").show();
      }
    } else {
      if (category == "all") {
        filterByColor(color);
      } else {
        filterByCategoryAndColor(category, color);
      }
    }
  });
}

function filterByColor(color) {
  products.forEach((product) => {
    if (product.color != color) {
      $(`#store__item-${product.id}`).hide();
    } else {
      $(`#store__item-${product.id}`).show();
    }
  });
}

function filterByCategory(category) {
  products.forEach((product) => {
    if (product.category != category) {
      $(`#store__item-${product.id}`).hide();
    } else {
      $(`#store__item-${product.id}`).show();
    }
  });
}

function filterByCategoryAndColor(category, color) {
  products.forEach((product) => {
    if (product.category != category || product.color != color) {
      $(`#store__item-${product.id}`).hide();
    } else {
      $(`#store__item-${product.id}`).show();
    }
  });
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
    // it doesnt get the products from the json and doesnt load the store items.
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