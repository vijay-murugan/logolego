// import {app} from "./firebase-config";
// import React from 'react'
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

function useFirebase() {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    const handleSignInFacebook = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
          // The signed-in user info.
          // const user = result.user;
            
          // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          // const credential = FacebookAuthProvider.credentialFromResult(result);
          // const accessToken = credential.accessToken;
          // console.log(result.user)
          result.redirect('/home')
          // ...
        })
        .catch((error) => {
          // // Handle Errors here.
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // // The email of the user's account used.
          // const email = error.email;
          // The AuthCredential type that was used.
         // const credential = FacebookAuthProvider.credentialFromError(error);
          console.log(error)
          // ...
        });
    };
    return {
      handleSignInFacebook,
};
}

export default useFirebase
