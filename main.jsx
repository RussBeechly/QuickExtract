
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import QuickExtract from "./QuickExtract";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
    <QuickExtract />
  </GoogleOAuthProvider>
);
