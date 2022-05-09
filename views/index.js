import React from "react";
import client from "react-dom/client";
import ReactDOM from "react-dom";
import App from "./App";
import AuthHOC from "./components/utility/AuthHOC";
const rootElement = document.getElementById("root");
const root = client.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <AuthHOC>
            <App></App>
        </AuthHOC>
    </React.StrictMode>
)