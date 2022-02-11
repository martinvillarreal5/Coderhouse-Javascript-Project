function createStoreItems() {
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
function addEventListenerToPlusButton(id) {
  $(`#cart__plus-btn-${id}`).click(function () {
    increaseProduct(id);
  });
}
function increaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected++;
  localStorage.setItem("cart", JSON.stringify(cart));
  $(`#cart__item-price-${id}`).text(`${product.price * product.selected}$`);
  $(`#cart__item-quantity-${id}`).text(`${product.selected}`);
  updateTotalPriceText();
}
function addProductToCart(id) {
  let product = products.find((item) => item.id == id);
  cart.push(product);
  increaseProduct(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  createCartItem(product);
  if (cart.length == 1) {
    createBuyButton();
    addEventListenerToBuyButton();
  }
  updateTotalPriceText();
}
function createCartItem(product) {
  let item = $(`<div id="cart__item-${product.id}" class="cart__item" >
                    <img src=${product.image} alt="aqui va una imagen">
                    <label  class="cart__item-name">${product.name} </label>
                    <label  class="cart__item-price" id="cart__item-price-${
                      product.id
                    }">${product.price * product.selected}$</label>
                    <button class="cart__minus-btn cart__qty-btn" id="cart__minus-btn-${
                      product.id
                    }"><i class="bi bi-dash-circle"></i></button>
                    <label  class="cart__item-quantity" id="cart__item-quantity-${
                      product.id
                    }">${product.selected}</label>
                    <button class="cart__qty-btn cart__plus-btn" id="cart__plus-btn-${
                      product.id
                    }"><i class="bi bi-plus-circle"></i>
                    </button>
                </div>`);
  $("#cart__container").append(item);
  addEventListenerToPlusButton(product.id);
  addEventListenerToMinusButton(product.id);
}

function addEventListenerToMinusButton(id) {
  $(`#cart__minus-btn-${id}`).click(function () {
    decreaseProduct(id);
  });
}
function decreaseProduct(id) {
  let product = cart.find((item) => item.id == id);
  product.selected--;
  if (product.selected == 0) {
    removeProductFromCart(product);
  } else {
    $(`#cart__item-price-${id}`).text(`${product.price * product.selected}$`);
    $(`#cart__item-quantity-${id}`).text(`${product.selected}`);
  }
  updateTotalPriceText();
  localStorage.setItem("cart", JSON.stringify(cart));
}
function removeProductFromCart(product) {
  const index = cart.indexOf(product); //devuelve el indice del producto
  if (index > -1) {
    cart.splice(index, 1); // remueve el index del array.el 1er parametro indica el indice, el 2do indica cantidad a borrar desde el indice
  }
  if (cart.length == 0) {
    $(".cart__buy-btn").remove();
  }
  $(`#cart__item-${product.id}`).remove();
}
function updateTotalPriceText() {
  let totalPrice = 0;
  //usar un reduce abajo
  cart.forEach((product) => {
    totalPrice += product.price * product.selected;
  });
  if (totalPrice == 0) {
    $("#cart__total-txt").text("");
  } else {
    $("#cart__total-txt").text(`Total: ${totalPrice}$`);
  }
}
function createBuyButton() {
  let buyBtn = $(
    `<button type="button" class="cart__buy-btn btn btn-success">Comprar</button>`
  );
  $("#cart").append(buyBtn);
}
function addEventListenerToBuyButton() {
  $(".cart__buy-btn").click(function () {
    alert("Compra realizada con exito");
    cart.splice(0, cart.length);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  });
}
function loadLocalCart() {
  cart.forEach((product) => {
    createCartItem(product);
  });
  updateTotalPriceText();
  createBuyButton();
  addEventListenerToBuyButton();
}

class Product {
  constructor(id, name, price, image, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
    this.selected = 0;
  }
}

function addEventListenerToNavCartButton(){
  $("#nav__cart-btn").click(function(){
    $("#cart").slideToggle("550");
  });
}
addEventListenerToNavCartButton();
const products = [];
$(document).ready(function () {
  $.getJSON("json/products.json", function (data) {
     data.forEach(function (item) {
      products.push(
        new Product(item.id, item.name, item.price, item.image, item.description)
      );
    });
    createStoreItems();
  });
});


localStorage.setItem("cart", JSON.stringify(null)); //storage desactivado temporalmente

const cart = JSON.parse(localStorage.getItem("cart")) || [];
if (cart.length > 0) {
  loadLocalCart();
}


