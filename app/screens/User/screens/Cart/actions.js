import * as actionTypes from './actionTypes'
import { api } from 'app/shared';
import _ from 'lodash';

/**
 * Async action - fetch cart.
 *
 * @return {function}
 */
export function fetchCart(refreshing) {
  return async function(dispatch, getState) {
    if (refreshing) {
      dispatch(refreshCart());
    } else {
      dispatch(requestCart());
    }

    let response = await api.call({
      url: '/api/v1/users/self/cart'
    });

    let cart = response.data;

    return dispatch(receiveCart(cart));
  }
}

export function refreshCart() {
  return {
    type: actionTypes.REFRESH_CART,
    cart: null,
    refreshing: true,
  }
}

export function requestCart() {
  return {
    type: actionTypes.REQUEST_CART,
    cart: null,
    loading: true,
    refreshing: false,
  }
}

export function receiveCart(cart) {
  return {
    type: actionTypes.RECEIVE_CART,
    cart: cart || {},
    loading: false,
    refreshing: false,
  }
}

/**
 * Async action - remove cart item.
 *
 * @return {function}
 */
export function removeCartItem(cartDateItemLinkId) {
  return async function(dispatch, getState) {
    dispatch(removingCartItem());

    let response = await api.call({
      url: `/api/v1/users/self/cart/${cartDateItemLinkId}`,
      method: 'delete',
    });

    let updatedCart = response.data;

    return dispatch(removedCartItem(updatedCart));
  }
}

export function removingCartItem() {
  return {
    type: actionTypes.REMOVING_CART_ITEM,
    loading: true,
  }
}

export function removedCartItem(updatedCart) {
  return {
    type: actionTypes.REMOVED_CART_ITEM,
    cart: updatedCart,
    loading: false,
  }
}

/**
 * Async action - update cart item.
 *
 * @return {function}
 */
export function updateCartItem(id, quantity) {
  return async function(dispatch, getState) {
    dispatch(updatingCartItem(id));

    let response = await api.call({
      url: '/api/v1/users/self/cart',
      method: 'put',
      data: {
        cartDateItemLinkId: id,
        quantity: quantity
      }
    });

    if (response.status !== 200) {
      dispatch({
        type: actionTypes.SHOW_ERROR,
        title: 'Fel kvantitet',
        message: 'för stor',
      });
    }

    if (_.isArray(response.data)) {
      dispatch(updatedCartItems(response.data));
    } else {
      dispatch(updatedCartItem(response.data));
    }
  }
}

export function updatingCartItem(id) {
  return {
    type: actionTypes.UPDATING_CART_ITEM,
    id: id,
  }
}

export function updatedCartItem(cartItem) {
  return {
    type: actionTypes.UPDATED_CART_ITEM,
    cartItem: cartItem,
  }
}

export function updatedCartItems(cartItems) {
  return {
    type: actionTypes.UPDATED_CART_ITEMS,
    cartItems: cartItems
  }
}

/**
 * Async action - update cart item.
 *
 * @return {function}
 */
export function createOrder() {
  return async function(dispatch, getState) {
    dispatch(creatingOrder());

    let response = await api.call({
      url: '/api/v1/users/self/order',
      method: 'post',
    });

    if (response.status !== 200) {
      dispatch({
        type: actionTypes.SHOW_ERROR,
        title: 'Fel kvantitet',
        message: 'för stor',
      });
    }

    dispatch(orderCreated());
  }
}