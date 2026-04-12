"use client";

import { useEffect } from "react";

const PHAICOM_ASCII = String.raw`
 ____  _   _    __    ____  ___  _____  __  __ 
(  _ \( )_( )  /__\  (_  _)/ __)(  _  )(  \/  )
 )___/ ) _ (  /(__)\  _)(_( (__  )(_)(  )    ( 
(__)  (_) (_)(__)(__)(____)\___)(_____)(_/\/\_)
`;

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(PHAICOM_ASCII);
  }, []);

  return null;
}
