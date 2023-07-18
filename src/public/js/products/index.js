const getCartId = () => localStorage.getItem('cartId');

const setCartId = (cartId) => localStorage.setItem('cartId', cartId);

const getProductCount = () => localStorage.getItem('productCount');

const setProductCount = (count) => localStorage.setItem('productCount', count);

let cartId = getCartId();

let productCount = getProductCount() || 0;

const cartIdElement = document.getElementById('cartId');
const cartQuantityElement = document.getElementById('cartQuantity');
const updateCartId = () => {
  
  cartIdElement.textContent = cartId;
  cartQuantityElement.innerHTML = `<div class="d-flex align-items-center justify-content-center">
   <div class="pe-2">
    <img src="../../img/cart.svg" alt="cart" />
   </div>
   <div>
    <h5 class="fw-bold mb-2 text-danger">${productCount}</h5>
   </div>
  </div>`;
};

const addToCartButtons = document.querySelectorAll('.btn-primary');

addToCartButtons.forEach((button) => {
  button.addEventListener('click', async (event) => {
    try {
      if (cartId === null) {
        const response = await fetch('/api/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const { payload } = await response.json();
          cartId = payload._id;
          setCartId(cartId);
          updateCartId();
          swal('Nuevo carrito creado', `ID del carrito: ${cartId}`, 'success');
        } else {
          swal('Error al crear el carrito', '', 'error');
          return;
        }
      }

      const productId = event.target.getAttribute('data-productid');

      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        swal('Producto agregado al carrito', `Product ID: ${productId}\nCart ID: ${cartId}`, 'success');

        productCount++;

        setProductCount(productCount);

        updateCartId();
      } else {
        swal('Error al agregar el producto al carrito', '', 'error');
      }
    } catch (error) {
      swal('Error al agregar el producto al carrito', '', 'error');
    }
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  try {
    if (cartId === null) {
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { payload } = await response.json();
        cartId = payload._id;
        setCartId(cartId);
        updateCartId();
        swal('Nuevo carrito creado', `ID del carrito: ${cartId}`, 'success');
      } else {
        swal('Error al crear el carrito', '', 'error');
      }
    } else {
      updateCartId();
    }

    const storedProductCount = getProductCount();

    if (storedProductCount && !isNaN(storedProductCount)) {
      productCount = parseInt(storedProductCount);
    }
  } catch (error) {
    swal('Error al crear el carrito', '', 'error');
  }
});

const redirectToCart = () => {
  const cartId = document.getElementById('cartId').textContent;
  window.location.href = `http://localhost:8080/carts/${cartId}`;
};
