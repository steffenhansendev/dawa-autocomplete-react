[![npm version](https://img.shields.io/npm/v/dawa-autocomplete-react.svg)](https://www.npmjs.com/package/dawa-autocomplete-react)
[![Bundle Size](https://img.shields.io/bundlephobia/min/dawa-autocomplete-react?label=size)](https://bundlephobia.com/result?p=dawa-autocomplete-react)

# dawa-autocomplete-react

## [Try with GitHub Pages](https://steffenhansendev.github.io/dawa-autocomplete-react/index.html) | [Consume with NPM](https://www.npmjs.com/package/dawa-autocomplete-react) | [Participate with GitHub](https://github.com/steffenhansendev/dawa-autocomplete-react)

## Manifest

By integrating with [Danmarks Adressers Web API (DAWA)](https://dawadocs.dataforsyningen.dk/dok/api/autocomplete), we
will provide a
plug-and-play React Element implementing the following:

> #### As a React developer,
>#### I want to insert only &lt;DawaAutocompleteAddressInput/&gt;,
>#### such that users may autocomplete a valid danish address to be observed at runtime.

We will provide minimal styling available for consumption by installing Bootstrap and delegate styling to consumers
otherwise.

- We will strive towards no dependencies other than React, React DOM, and optionally Bootstrap,
- user agnosticism towards whether an address is of type entrance or of type address (see below),
- complying with accessibility standards,
- supporting mobile no less than desktop devices,
- high convenience for consumers,
- high configurability for consumers,
- high maintainability and flexibility in the source,
- low coupling and high cohesion in the source,
- and we will acknowledge being an alternative to [dawa-autocomplete2](https://github.com/SDFIdk/dawa-autocomplete2)

### Terminology

A valid address is defined as designating **necessarily**
a unique identifier with DAWA,
a type (being either *entrance* or *address*),
a street name,
a house number,
a zipcode,
and a zipcode name;
and as designating **optionally**
a floor,
a door,
a street code,
an addressing street name,
a supplementary city name,
a municipality code,
a status,
a dar status,
a unique identifier with DAWA for its entrance address,
a latitude and a longitude,
and a href.

These are mapped from DAWA as according to `mapResDtoToAddress()`.

In [DAWA-terms](https://dawadocs.dataforsyningen.dk/dok/api/adgangsadresse), the difference between an *entrance*
address and an *address* address is:

> An *address* encompasses potentially a floor and/or door designation. An *entrance* does not.

That is, the *entrance* of an *address* does not designate its floor and/or door. As such, an *address* has higher
precision than an *entrance*.

Multiple *addresses* may reference the same *entrance* through their unique identifier for *entrance*. As such,
*addresses* of an *entrance* are precisions of that particular *entrance*.

Currently, with [dawa-autocomplete2](https://github.com/SDFIdk/dawa-autocomplete2), the consuming developer must
determine that **either** *entrance* **or** *address* constitutes an autocompletion. With **dawa-autocomplete-react**,
this responsibility is delegated to the user based on the assumption that they may or may not find an *entrance*
sufficiently precise for their purpose. This means the `<input>` is technically valid for **both** *entrance* **and**
*address*, and an output address is observable in **both** cases.

## Consumption

1) Install with NPM:

```shell
npm install dawa-autocomplete-react
```

2) Insert as React Element:

```tsx
<DawaAutocompleteAddressInput addressObserver={(a) => {}}/>
```

### Apply default styling

1) Install Bootstrap [Bootstrap](https://getbootstrap.com):

```shell
npm install bootstrap
```

2) Import:

```ts
import 'bootstrap/dist/css/bootstrap.css';
```
### Apply custom styling

The CSS classes (see below) applied can also be selected for custom styling (in combination with Bootstrap).
That is, installing Bootstrap is entirely optional.

### Configuration

The following is provided from dawa-autocomplete-react.config.json.

| Property                                         | Type      | Static                                                 | Description                                                                                      |
|--------------------------------------------------|-----------|--------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `placeholder`                                    | `string`  | `"Enter Danish address ..."`                           | Displayed in the input when empty                                                                |
| `isAutoFocus`                                    | `boolean` | `false`                                                | Whether the input is rendered in focus                                                           |
| `errorMessageOnApiClientFailure`                 | `string`  | `"Integration with external address registry failed."` | Displayed in the disabled input when API requests fail                                           |
| `loadingMessageOnApiClientRequest`               | `string`  | `"Loading"`                                            | Displayed as a single dropdown option while awaiting API response. Suffixed with animated " ..." |
| `apiRequestLoadingIndicatorDebounceMilliseconds` | `number`  | `150`                                                  | Delay (ms) before showing loading message while awaiting API response                            |
| `apiRequestTypingDebounceMilliseconds`           | `number`  | `150`                                                  | Delay (ms) before dispatching API requests triggered by typing input                             |
| `autocompleteAddressApiClient`                   | `object`  | —                                                      | API client configuration                                                                         |
| `styling`                                        | `object`  | —                                                      | Class names for styling the HTML elements                                                        |
| `ariaLabel`                                      | `string`  | `"Search input"`                                       | Accessibility label for the `<input`> element                                                    |

---

### `autocompleteAddressApiClient`

| Property         | Type     | Static                             | Description                                 |
|------------------|----------|------------------------------------|---------------------------------------------|
| `host`           | `string` | `"https://api.dataforsyningen.dk"` | API host URL                                |
| `uri`            | `string` | `"autocomplete"`                   | API endpoint path                           |
| `maxResultCount` | `number` | `15`                               | Maximum number of results returned from API |

---

### `styling.textNodeSearchInput`

| Property                      | Type       | Static                             | Default (Bootstrap) | Description                                               |
|-------------------------------|------------|------------------------------------|---------------------|-----------------------------------------------------------|
| `divElementClassNames`        | `string[]` | `["autocomplete-input-container"]` | `["dropdown"]`      | Class names for the `<div>` enclosing the `<input>`       |
| `inputElementClassNames`      | `string[]` | `["autocomplete-input"]`           | `["form-control"]`  | Class names for the input `<input>` element itself        |
| `inputElementValidClassNames` | `string[]` | `["autocomplete-input-valid"]`     | `["is-valid"]`      | Class names applied when a non-null Address is observable |

---

### `styling.textNodeSearchInputDropdown`

| Property                        | Type       | Static                                     | Default (Bootstrap)  | Description                                                                      |
|---------------------------------|------------|--------------------------------------------|----------------------|----------------------------------------------------------------------------------|
| `ulElementClassNames`           | `string[]` | `["autocomplete-input-option-list"]`       | `["dropdown-menu"]`  | Class names for the `<ul>` element making up the dropdown options menu           |
| `liElementsClassNames`          | `string[]` | `["autocomplete-input-option"]`            | `["dropdown-item"]`  | Class names for `<li>` elements making up the dropdown menu options              |
| `liElementsActiveClassNames`    | `string[]` | `["autocomplete-input-option-active"]`     | `["active"]`         | Class names applied to the `<li>` elements currently select via keyboard up/down |
| `liElementsMouseOverClassNames` | `string[]` | `["autocomplete-input-option-mouse-over"]` | `["bg-dark-subtle"]` | Class names applied to the `<li>` elements currently hovered over with a cursor  |

---

Consumers may opt in overrides for each property selectively via the `configurationOverride` prop of
`DawaAutoCompleteAddressInput`. For `styling`, only the Bootstrap classes are overridden.

For instance, a danish translation may look as such:
```tsx
<DawaAutocompleteAddressInput 
        configurationOverride={{
            placeholder: "Søg efter dansk adresse ...",
            loadingMessageOnApiClientRequest: "Søger",
            errorMessageOnApiClientFailure: "Integrationsfejl opstod.",
            ariaLabel: "Søgefelt",
        }}
        addressObserver={(a) => {}}
/>
```

## Participation

This is a free and open sourced project. Participation is encouraged!

#### [GitHub Issues](https://github.com/steffenhansendev/dawa-autocomplete-react/issues)

Clone:

```shell
git clone https://github.com/steffenhansendev/dawa-autocomplete-react.git
```

Lint and transpile to `out/src`:

```shell
npm run build
```

Lint and transpile to `out/src`, bundle the GitHub Pages demo at `out/test/index.html`:

```shell
npm run bundleDemo
```

Lint and transpile to `out/src`, bundle the GitHub Pages demo at `out/test/index.html`, and re-bundle with changes:

```shell
npm run watchDemo
```

### Contribution guidelines

- Appreciate the manifest
- Compartmentalize by feature and domain, rather than by technology or architecture
    - That is, no dedicated directories for hooks, components, etc.
- Document behavior with automated tests before refactoring
- Appreciate the dependencies between `src/configuration`, `src/core` `src/infrastructure`, `src/shared`, and `/src`
    - That is, `src/core` may depend only on `src/shared`, and `src/shared` on nothing
- Appreciate that searching for addresses is modeled generically in
  `src/core/text-node-search`
    - That is, `/src/core/text-node-search` is address-agnostic
- Consider contributions to the README itself