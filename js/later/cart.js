


function loadLocalStorageCart() {
    cart.forEach((product) => {
      renderCartItem(product);
    });
    toggleShowNavCartBadge();
    updateNavCartCounter();
    updateTotalPriceText();
    renderBuyButton();
  }
  
  const cart = JSON.parse(localStorage.getItem("cart")) || [];


  if (cart.length > 0) {
    loadLocalStorageCart();
  }
  addEventListenerToNavCartButton();
  
