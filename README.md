# Kaspian 🥮
### 👛 Most compact way to use your Kaspa elegantly.

Introducing Kaspian, a self-custodial Kaspa wallet with built-in merchant tool and provider api.

## Features

- [x] Create wallet
- [x] Import wallet(Disabled for now)
- [x] Derive addresses(UI is limited)
- [x] Send transactions
- [x] Node selection, multiple networks(Awaiting some WASM fixes)
- [x] Receive with QR code generation
- [] Provider api
- [x] Themes
- [x] Internationalization(70% exported)


## Installation

Kaspian is currently not available in web stores as it is in its alpha stage. The only method for installation is through local builds using developer tools.

## Development

Ensure you have Node.js version 16 or higher installed. If not, please install the latest version of Node.js to proceed with the development process.

Install the required Node.js modules using the command ``npm install`` and get WASM binaries from [here](https://kaspa.aspectron.org/nightly/downloads/) or by building it yourself from rusty-kaspa. Once obtained, place the WASM binaries into the ``./wasm`` folder.

### Testing

To begin testing, execute ``npm run dev`` to run the development server. Then, utilize the contents of the dist folder as an unpacked extension in your browser for testing purposes.
