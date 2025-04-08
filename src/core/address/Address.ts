import {AddressType} from "./AddressType";
import {Coordinates} from "./Coordinates";

export interface Address {
    readonly id: string;
    readonly type: AddressType;

    readonly streetName: string;
    readonly houseNumber: string;
    readonly zipCode: string;
    readonly zipCodeName: string;

    readonly floor: string | null;
    readonly door: string | null;
    readonly streetCode: string | null;
    readonly addressingStreetName: string | null;
    readonly supplementaryCityName: string | null;
    readonly municipalityCode: string | null;

    readonly status: number | null;
    readonly darStatus: number | null;

    readonly entranceAddressId: string | null; // Only for type = Address
    readonly location: Coordinates | null;
    readonly href: string | null;
}