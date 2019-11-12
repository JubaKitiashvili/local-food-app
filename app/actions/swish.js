import { SWISH_STARTED, SWISH_SUCCESS, SWISH_FAILED, SWISH_DECLINED } from 'app/types/swish'
import {API_URL} from 'app/env.json'
import {Linking, AsyncStorage } from 'react-native'
import api from 'app/shared/api';

export function swishStarted() {
  return {
    type: SWISH_STARTED,
  }
}
export function swishSuccess(membership_payments_relationship) {
  return {
    type: SWISH_SUCCESS,
    membership_payments_relationship: membership_payments_relationship,
    title: 'payment_success_header',
    message: 'payment_success',
  }
}
export function swishFailed() {
  return {
    type: SWISH_FAILED,
  }
}

export function swishDeclined() {
  return {
    type: SWISH_DECLINED,
    title: 'payment_failiure_header',
    message: 'payment_failiure',
  }
}



export function startSwish(amount) {
  return async function (dispatch, getState) {
    try {
      dispatch(swishStarted());
      

      let response = await api.call({
        url: `/api/v1/swish?amount=${amount}`,
        amount: amount,
        method: 'POST',
      });
  
      const res = await response.json();
      // console.log(res);

      Linking.addEventListener('url', (res) => {
        // console.log(res);
        
      })
  
      try {
        const url = `swish://paymentrequest?token=${res.token}&callbackurl=localfoodapp://swishFinished`
        
        Linking.openURL(encodeURI(url));
      } catch(e) {
        // console.log(e);
        
      }
      // check status
      
      setTimeout(() => waitForSwishResponse(dispatch, res, 0), 1000);
      
    } catch (error) {
      dispatch(swishFailed(error));
    }
  }
}

async function waitForSwishResponse(dispatch, res, i) {
  let response = await api.call({
    url: `/api/v1/swish?id=${res.external_id}`,
    id: res.external_id,
  });
  const jres = await response.json();
  // console.log(jres);
  
  if (jres.status === 'CREATED') {
    if (i < 300) {
      setTimeout(() => waitForSwishResponse(dispatch, res, i+1), 3000);
    } else {
      dispatch(swishFailed("timeout"))
    }
  } else if (jres.status === 'PAID') {
    // this.props.
    let storedUser = await AsyncStorage.getItem('@store:user');
    storedUser = JSON.parse(storedUser);
    let updatedUser = Object.assign({}, storedUser, {membership_payments_relationship: jres.user_membership_payment});
    await AsyncStorage.setItem('@store:user', JSON.stringify(updatedUser));
    // console.log(updatedUser);
    
    dispatch(swishSuccess(jres.user_membership_payment))
  } else if (jres.status === "DECLINED") {
    // handle declined  TODO:
    dispatch(swishDeclined(jres.user_membership_payment))
  }
}