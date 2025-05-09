import React, {ReactElement, useState} from "react";
import {Address, DawaAutocompleteAddressInput} from "../../src";

function DawaAutocompleteAddressInputDemo(): ReactElement {
    const [address, setAddress] = useState<Address | null>();
    return <>
        <div>
            <DawaAutocompleteAddressInput addressObserver={(address: Address | null): void => setAddress(address)}/>
        </div>
        <div>
            <pre>
            {JSON.stringify(address, null, "\t")}
            </pre>
        </div>
    </>
}

export default DawaAutocompleteAddressInputDemo;