import * as actionTypes from './actionTypes';
import _ from 'lodash';

function cartReducer(state, action) {
  switch (action.type) {
    case actionTypes.REQUEST_CART:
    case actionTypes.RECEIVE_CART:
      return Object.assign({}, state, {
        cart: action.cart,
        loading: action.loading,
        updatingCartItems: [],
        removingCartItems: [],
        refreshing: action.refreshing || false,
      });
      break;

    case actionTypes.REFRESH_CART:
      return Object.assign({}, state, {
        refreshing: action.refreshing,
      });
      break;

    case actionTypes.REMOVING_CART_ITEM:
      state.removingCartItems.push(action.cartDateItemLinkId);
      return Object.assign({}, state, {
        removingCartItems: [...new Set(state.removingCartItems)]
      });
      break;

    case actionTypes.REMOVED_CART_ITEM:
    case actionTypes.REMOVE_CART_ITEM_FAILED:
      let removingCartItems = state.removingCartItems;
      let removeIndex = removingCartItems.indexOf(action.cartDateItemLinkId);

      if (removeIndex > -1) {
        removingCartItems.splice(removeIndex, 1);
      }

      return Object.assign({}, state, {
        removingCartItems: removingCartItems,
        cart: state.cart.filter(cartItem => {
          return action.cartDateItemLinkId != cartItem.id;
        }),
      });
      break;

    case actionTypes.UPDATING_CART_ITEM:
      state.updatingCartItems.push(action.id);
      return Object.assign({}, state, {
        updatingCartItems: [...new Set(state.updatingCartItems)]
      });
      break;

    case actionTypes.UPDATED_CART_ITEM:
    case actionTypes.UPDATING_CART_ITEM_FAILED:
      let updatingCartItems = state.updatingCartItems;
      let updateIndex = updatingCartItems.indexOf(action.cartItem.id);

      if (updateIndex > -1) {
        updatingCartItems.splice(updateIndex, 1);
      }

      return Object.assign({}, state, {
        updatingCartItems: updatingCartItems,
        cart: state.cart.map(cartItem => {
          return action.cartItem.id === cartItem.id ? action.cartItem : cartItem;
        }),
      });
      break;

    case actionTypes.ORDER_DONE:
      return Object.assign({}, state);
      break;

    case actionTypes.CREATE_ORDER_IN_PROGRESS:
      return Object.assign({}, state, {
        loading: action.loading,
        creating: action.creating,
      });
      break;

    case actionTypes.CREATE_ORDER_SUCCESS:
    case actionTypes.CREATE_ORDER_FAILED:
      return Object.assign({}, state, {
        cart: action.cart,
        loading: action.loading,
        creating: action.creating,
        created: action.created,
      });
      break;

    // If order is placed and a new product is placed in cart we need to reset order success state.
    case 'ADD_TO_CART_SUCCESS':
      return Object.assign({}, state, {
        cart: action.cart,
        loading: action.loading,
        creating: false,
        created: false,
      });
      break;

    default:
      return Object.assign({}, state, {});
      break;
  }
}

export default cartReducer;
