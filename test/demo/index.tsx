import React from "react";
import ReactDOM, {Root} from "react-dom/client";

import "bootstrap/dist/css/bootstrap.css";

import DawaAutocompleteAddressInputDemo from "./DawaAutocompleteAddressInputTest";

const root: Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<DawaAutocompleteAddressInputDemo></DawaAutocompleteAddressInputDemo>);