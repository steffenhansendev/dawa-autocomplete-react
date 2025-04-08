import React, {useMemo} from "react";
import {
    createAutocompleteAddressApiClient
} from "./infrastructure/dataforsyningen/create-autocomplete-address-api-client";
import {configuration, configure} from "./configuration/configure";
import {
    createAutocompleteAddressApiClientDebounceDecorator
} from "./infrastructure/create-autocomplete-address-api-client-debounce-decorator";
import {createTextNodeTreeService} from "./infrastructure/create-text-node-tree-service";
import {Address} from "./core/address/Address";
import {TextNodeTree} from "./core/text-node-search/TextNodeSearchInput/TextNodeTree";
import {useTextNodeTree} from "./core/text-node-search/useTextNodeTree";
import TextNodeSearchInput from "./core/text-node-search/TextNodeSearchInput/TextNodeSearchInput";
import {Configuration} from "./configuration/Configuration";
import {TextNodeTreeService} from "./core/text-node-search/TextNodeTreeService";
import {DeepPartial} from "./shared/DeepPartial";

export interface DawaAutocompleteAddressInputProps {
    addressObserver: (address: Address | null) => void;
    configurationOverride?: ConfigurationOverride;
}

export type ConfigurationOverride = DeepPartial<Configuration>;

function DawaAutocompleteAddressInput({
                                          addressObserver,
                                          configurationOverride
                                      }: DawaAutocompleteAddressInputProps): React.ReactElement {
    configure(configurationOverride);
    const service: TextNodeTreeService<Address> = useMemo((): TextNodeTreeService<Address> => {
        return createTextNodeTreeService(
            createAutocompleteAddressApiClientDebounceDecorator(
                createAutocompleteAddressApiClient()
            )
        )
    }, []);
    const textNodeTree: TextNodeTree = useTextNodeTree<Address>(service, addressObserver);
    return (
        <TextNodeSearchInput
            placeholder={configuration.placeholder}
            isAutoFocus={configuration.isAutoFocus}
            textNodeTree={textNodeTree}
        />
    );
}

export default DawaAutocompleteAddressInput;