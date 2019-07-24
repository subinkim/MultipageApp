/*import*/
import React from 'react';

/*URLs*/
export const LoginURL = 'https://www.devemerald.com/login';
export const GetHomesURL = "https://www.devemerald.com/api/v1/ops/get-homes";
export const LogoutURL = 'https://www.devemerald.com/logout';

/*AsyncStorage keys*/
const CSRF_KEY = '@csrftoken';
const DEVICE_UUID_KEY = '@deviceUUID';
const DEVICE_SSID_KEY = '@deviceSSID';
const DEVICE_PWD_KEY = '@devicePWD';

class Storage {

  /*Sign in with credentials*/
  signIn(email, password){
    let response = fetch(LoginURL, {
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
        return true;
      });
    }).catch((error) => {
      console.log(error);
      return false;
    });
    return response;
  }

  /*signOut*/
  signOut(){
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
  checkCSRFToken(csrftoken){
    let response = fetch(GetHomesURL, {
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
          return text['success'];
        } else {
          return false;
        }
      });
    });
    return response;
  }

  /*Store item to AsyncStorage*/
  async setItem(key, item){
    try {
      await AsyncStorage.setItem(key, item);
    } catch (e) {
      console.log(e);
    }
  }

  /*Get item from AsyncStorage and call next function*/
  async getItem(nextFunc){
    var value = await AsyncStorage.getItem(CSRF_KEY).then((item) => {
      nextFunc(item);
    });
  }

  /*Get list of homes from the website*/
  getHomes(csrftoken, nav){
    let response = fetch(GetHomesURL, {
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
        return text;
        });
    });
    return response; //TODO: check if this works - if it doesn't, then deal with nav
  };
}

export default Storage;
