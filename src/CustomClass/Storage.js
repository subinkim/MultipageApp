/*import*/
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from 'react-native-cookies';

/*URLs*/
export const MainURL = 'www.devemerald.com';
export const LoginURL = 'https://www.devemerald.com/login';
export const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";
export const LogoutURL = 'https://www.devemerald.com/logout';
export const RegisterHomeURL = 'https://www.devemerald.com/api/v1/ops/register-home';
export const RegisterURL = 'https://www.devemerald.com/api/v1/ops/register-deployment';
export const ModifyDeploymentURL = 'https://www.devemerald.com/api/v1/ops/modify-deployment';

/*AsyncStorage keys*/
export const CSRF_KEY = '@csrftoken';
export const DEVICE_UUID_KEY = '@deviceUUID';
export const DEVICE_SSID_KEY = '@deviceSSID';
export const DEVICE_PWD_KEY = '@devicePWD';
export const COOKIE_KEY = '@cookieValid';

/*Sign in with credentials*/
export function signIn(email, password){
  var returnVal = false;
  fetch(LoginURL, {
    method: 'POST',
    headers: {
      Accept:'*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'email='+email+'&password='+password,
    credentials: "include",
  }).then((response) => {
    CookieManager.getAll()
    .then((res) => {
      let csrftoken = res['csrftoken']['value'];
      setItem(CSRF_KEY, csrftoken);
      returnVal = true;
      console.log("response in CM:",returnVal);
    });
  }).catch((error) => {
    console.log(error);
  });
  console.log("response=",returnVal);
  return returnVal;
}

/*signOut*/
export function signOut(){
  AsyncStorage.getItem(CSRF_KEY).then((csrftoken) => {
    fetch(LogoutURL, {
      credentials:"include",
      headers: {
          'X-CSRFToken': csrftoken,
          referer: 'https://www.devemerald.com/',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      method:'GET',
      mode:'cors',
    });
    AsyncStorage.removeItem(CSRF_KEY);
  });
}

/*Check the validity of csrftoken*/
export function checkCSRFToken(csrftoken){
  let res;
  fetch(GetHomesURL, {
    credentials:"include",
    headers: {
        'X-CSRFToken': csrftoken,
        referer: 'https://www.devemerald.com/',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method:'POST',
    mode:'cors',
  }).then(function(response){
    return response.text().then(function(text){
      text = JSON.parse(text);
      if (text['success'] != null){
        res = text['success'];
      } else {
        res = false;
      }
    });
  });
  return res;
}

/*Store item to AsyncStorage*/
export async function setItem(key, item){
  try {
    await AsyncStorage.setItem(key, item);
  } catch (e) {
    console.log(e);
  }
}

/*Get item from AsyncStorage and call next function*/
export async function getItem(nextFunc, key){
  var value = await AsyncStorage.getItem(key).then((item) => {
    nextFunc(item);
  });
}

/*Remove item*/
export async function removeItem(key){
  AsyncStorage.removeItem(key);
}

/*Get list of homes from the website*/
export function getHomes(csrftoken){
  let res;
  fetch(GetHomesURL, {
    credentials:"include",
    headers: {
        'X-CSRFToken': csrftoken,
        referer: 'https://www.devemerald.com/',
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method:'POST',
    mode:'cors',
  }).then(function(response){
    return response.text().then(function(text){
      text = JSON.parse(text);
      res = text;
      });
  });
  return res; //TODO: check if this works - if it doesn't, then deal with nav
};
