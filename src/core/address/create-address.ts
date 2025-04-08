import {Address} from "./Address";
import {AddressType} from "./AddressType";

export function createAddress(
    id: string,
    type: AddressType,
    streetName: string,
    houseNumber: string,
    zipCode: string,
    zipCodeName: string,
    floor?: string,
    door?: string,
    streetCode?: string,
    addressingStreetName?: string,
    supplementaryCityName?: string,
    municipalityCode?: string,
    status?: number,
    darStatus?: number,
    entranceAddressId?: string,
    latitude?: number,
    longitude?: number,
    href?: string
): Address {
    return {
        id: id,
        type: type,
        streetName: streetName,
        houseNumber: houseNumber,
        zipCode: zipCode,
        zipCodeName: zipCodeName,
        floor: floor ?? null,
        door: door ?? null,
        streetCode: streetCode ?? null,
        addressingStreetName: addressingStreetName ?? null,
        supplementaryCityName: supplementaryCityName ?? null,
        municipalityCode: municipalityCode ?? null,
        status: status ?? null,
        darStatus: darStatus ?? null,
        entranceAddressId: entranceAddressId ?? null,
        location: (!!latitude && !!longitude) ? {latitude: latitude, longitude: longitude} : null,
        href: href ?? null
    }
}