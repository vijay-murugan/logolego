//import {app} from "./firebase-config";
import { useNavigate } from 'react-router-dom';
//import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function useFirebase() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    let navigate = useNavigate();
    const handleSignInGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
   // const credential = GoogleAuthProvider.credentialFromResult(result);
   // const token = credential.accessToken;
    // The signed-in user info.
    //const user = result.user;
    navigate('/home')
    // ...
  }).catch((error) => {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.email;
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error)
    // ...
  });
    };
    return {
      handleSignInGoogle,
};
}

export default useFirebase
