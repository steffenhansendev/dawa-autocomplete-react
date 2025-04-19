import React, {ReactElement, useMemo} from "react";
import {
    createAutocompleteAddressApiClient
} from "./infrastructure/dataforsyningen/create-autocomplete-address-api-client";
import {configuration, configure} from "./configuration/configure";
import {createAddressTextNodeTreeService} from "./infrastructure/create-address-text-node-tree-service";
import {Address} from "./core/address/Address";
import {TextNodeTree} from "./core/text-node-search/TextNodeSearchInput/TextNodeTree";
import {useTextNodeTree} from "./core/text-node-search/useTextNodeTree";
import TextNodeSearchInput from "./core/text-node-search/TextNodeSearchInput/TextNodeSearchInput";
import {Configuration} from "./configuration/Configuration";
import {TextNodeTreeService} from "./core/text-node-search/TextNodeTreeService";
import {DeepPartial} from "./shared/DeepPartial";
import {
    createTextNodeTreeServiceDebounceDecorator
} from "./infrastructure/create-text-node-tree-service-debounce-decorator";

export interface DawaAutocompleteAddressInputProps {
    addressObserver: (address: Address | null) => void;
    configurationOverride?: ConfigurationOverride;
}

export type ConfigurationOverride = DeepPartial<Configuration>;

function DawaAutocompleteAddressInput({
                                          addressObserver,
                                          configurationOverride
                                      }: DawaAutocompleteAddressInputProps): ReactElement {
    configure(configurationOverride);
    const service: TextNodeTreeService<Address> = useMemo((): TextNodeTreeService<Address> => {
        return createTextNodeTreeServiceDebounceDecorator(createAddressTextNodeTreeService(createAutocompleteAddressApiClient()));
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