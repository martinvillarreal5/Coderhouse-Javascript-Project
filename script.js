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

function renderCartItem(product) {
  let item = $(`<div id="cart__item-${product.id}" class="cart__item" >
                    <img src=${product.image} alt="aqui va una imagen">
                    <label  class="cart__item-name">${product.name} </label>
                    <label  class="cart__item-price" id="cart__item-price-${
                      product.id
                    }">${product.price * product.selected}$</label>
                    <button class="cart__minus-btn cart__qty-btn" id="cart__minus-btn-${
                      product.id
                    }"><i class="bi bi-dash-circle"></i></button>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" value="${
                      product.selected
                    }" class="cart__item-quantity" id="cart__item-quantity-${
    product.id
  }"> 
                    <button class="cart__qty-btn cart__plus-btn" id="cart__plus-btn-${
                      product.id
                    }"><i class="bi bi-plus-circle"></i>
                    </button>
                    <button class="cart__remove-btn" id="cart__remove-btn-${
                      product.id
                    }"><i class="bi bi-trash"></i></button>
                </div>`);
  $("#cart__container").append(item);
  addEventListenerToQuantityInput(product.id);
  addEventListenerToPlusButton(product.id);
  addEventListenerToMinusButton(product.id);
  addEventListenerToRemoveProductButton(product.id);
}
function renderBuyButton() {
  let buyBtn = $(
    `<button type="button" id="cart__buy-btn" class="btn btn-success">Comprar</button>`
  );
  $("#cart").append(buyBtn);
  addEventListenerToBuyButton();
}

function addProductToCart(id) {
  let product = products.find((item) => item.id == id);
  cart.push(product);
  increaseProduct(id);
  updateLocalStorage("cart", cart);
  renderCartItem(product);
  updateNavCartCounter();
  if (cart.length == 1) {
    renderBuyButton();
    toggleShowNavCartBadge();
  }
  updateTotalPriceText();
}
function increaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected++;
  updateLocalStorage("cart", cart);
  updateItemQuantity(product.id, product.selected);
  updateItemPrice(id, product.price * product.selected);
  updateTotalPriceText();
}

function decreaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected--;
  if (product.selected == 0) {
    removeProductFromCart(product);
  } else {
    updateItemQuantity(product.id, product.selected);
    updateItemTotalPrice(product.id, product.selected * product.price);
    updateLocalStorage("cart", cart);
    updateTotalPriceText();
  }
}

function removeProductFromCart(product) {
  const index = cart.indexOf(product); //devuelve el indice del producto
  if (product.selected > 0) {
    product.selected = 0; // ya que el producto comparte direccion de memoria con en ambos arrays. si llamo a esta funcion sin antes llamar decrease product, el producto no se actualiza y cuando agrego nuevamente el producto al carro conserva la cantidad que tenia al momento de llamar esta funcion en vez de 0 como deberia ser
  }
  if (index > -1) {
    cart.splice(index, 1); // remueve el index del array.el 1er parametro indica el indice, el 2do indica cantidad a borrar desde el indice
  }
  if (cart.length == 0) {
    $("#cart__buy-btn").remove(); //TODO cambiar a ocultar/mostar
    toggleShowNavCartBadge();
  }
  $(`#cart__item-${product.id}`).slideUp(500, function () {
    $(`#cart__item-${product.id}`).remove();
  });
  updateNavCartCounter();
  updateLocalStorage("cart", cart);
  updateTotalPriceText();
}

function updateItemPrice(id, total) {
  $(`#cart__item-price-${id}`).text(`${total}$`);
}

function updateItemQuantity(id, quantity) {
  $(`#cart__item-quantity-${id}`).val(quantity);
}
function updateItemTotalPrice(id, value) {
  $(`#cart__item-price-${id}`).text(`${value}$`);
}

function addEventListenerToMinusButton(id) {
  $(`#cart__minus-btn-${id}`).click(function () {
    decreaseProduct(id);
  });
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

function updateNavCartCounter() {
  $("#nav__cart-counter").text(cart.length);
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
function addEventListenerToPlusButton(id) {
  $(`#cart__plus-btn-${id}`).click(function () {
    increaseProduct(id);
  });
}

function addEventListenerToQuantityInput(id) {
  $(`#cart__item-quantity-${id}`).change(function () {
    let product = cart.find((item) => item.id == id);
    let quantity = parseInt($(`#cart__item-quantity-${id}`).val());
    if (quantity == 0) {
      removeProductFromCart(product);
    } else if (quantity < 0) {
      // add popover saying wrong value or block input for only 0/1-99 numbers
      updateItemQuantity(product.id, product.selected);
      updateItemTotalPrice(product.id, product.selected * product.price);
    } else {
      product.selected = quantity;
      updateItemQuantity(product.id, product.selected);
      updateItemTotalPrice(product.id, product.selected * product.price);
      updateLocalStorage("cart", cart);
      updateTotalPriceText();
    }
  });
}

function addEventListenerToRemoveProductButton(id) {
  $(`#cart__remove-btn-${id}`).click(function () {
    let product = cart.find((item) => item.id == id);
    removeProductFromCart(product);
  });
}

function addEventListenerToBuyButton() {
  $("#cart__buy-btn").click(function () {
    alert("Compra realizada con exito");
    cart.splice(0, cart.length);
    updateLocalStorage("cart", cart);
    location.reload();
  });
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

function loadLocalStorageCart() {
  cart.forEach((product) => {
    renderCartItem(product);
  });
  toggleShowNavCartBadge();
  updateNavCartCounter();
  updateTotalPriceText();
  renderBuyButton();
}

function updateLocalStorage(keyName, keyValue) {
  localStorage.setItem(keyName, JSON.stringify(keyValue));
}

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

//main

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length > 0) {
  loadLocalStorageCart();
}
addEventListenerToNavCartButton();

const products = [];
let testarray = [];
$(document).ready(function () {
  $.getJSON("json/products.json", function (data) {
    data.forEach(function (item) {
      products.push(
        new Product(
          item.id,
          item.name,
          item.price,
          item.image,
          item.description,
          item.category
        )
      );
    });
    renderStoreItems();
  });
});
