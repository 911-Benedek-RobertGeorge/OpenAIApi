import React, { useEffect } from "react";
import { ExtensionLoginButton } from "@multiversx/sdk-dapp/UI";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";

function MyLoginComponent() {
  const { isLoggedIn } = useGetLoginInfo();

  //this have to be the same as in the data marshal request
  const commonProps = {
    callbackRoute: "/",
    nativeAuth: {
      apiAddress: "https://devnet-api.multiversx.com",
      expirySeconds: 3000,
    },
  };

  useEffect(() => {
    if (isLoggedIn) console.log("User is logged in");
  }, [isLoggedIn]);

  return <ExtensionLoginButton loginButtonText="Connect Wallet" {...commonProps} />;
}

export default MyLoginComponent;
