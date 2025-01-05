# foodbiz

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App Locally](#running-the-app-locally)
- [Building for Production](#building-for-production)
- [Testing on a Physical Device](#testing-on-a-physical-device)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 16 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (optional) - [Install Yarn](https://yarnpkg.com/)
- **Expo CLI** - [Install Expo CLI](https://docs.expo.dev/get-started/installation/)
- **Git** - [Install Git](https://git-scm.com/)
- **iOS or Android Emulator**, or a physical iPad for testing.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:EliavYair1/foodbiz.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ipad-app
   ```

3. Install dependencies:

   Using npm:
   ```bash
   npm install
   ```

   Using yarn:
   ```bash
   yarn install
   ```

## Running the App Locally

1. Start the development server:

   Using npm:
   ```bash
   npm start
   ```

   Using yarn:
   ```bash
   yarn start
   ```

2. Open the app:
   - Use the **Expo Go** app on your iPad to scan the QR code generated in the terminal.
   - Alternatively, open the app on an iOS or Android emulator.

## Building for Production

To build a production-ready version of the app:

1. Create a build using Expo:
   ```bash
   eas build --platform ios
   ```
   (Replace `ios` with `android` if building for Android devices.)

2. Follow the instructions provided by Expo to distribute your app.
   - For more details, visit [Expo Build Documentation](https://docs.expo.dev/build/introduction/).

## Testing on a Physical Device

1. Install the **Expo Go** app on your iPad or Android device.
2. Start the development server:

   ```bash
   npm start
   ```

3. Scan the QR code displayed in the terminal or browser.
4. The app will load in the Expo Go app.

## Contributing

Contributions are welcome! If you find a bug or want to add a feature:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a meaningful commit message"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
