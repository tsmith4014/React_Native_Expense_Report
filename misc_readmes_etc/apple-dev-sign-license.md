# To run your React Native app on a physical iOS device using your Apple Developer license, you'll need to configure your project in Xcode. Here are the detailed steps to get your React Native project running on a physical device

## Steps to Configure and Run on a Physical Device

1. **Open the Project in Xcode**:

   - Navigate to your React Native project directory.
   - Open the `ios` folder.
   - Double-click on the `.xcworkspace` file to open the project in Xcode.

2. **Set Up Your Apple Developer Account**:

   - **Open Xcode Preferences**:
     - Go to `Xcode` > `Preferences` > `Accounts`.
   - **Add Your Apple ID**:
     - Click on the `+` button to add your Apple ID.
     - Sign in with your Apple Developer account credentials.

3. **Select Your Development Team**:

   - **Select the Project**:
     - In Xcode, select your project from the Project Navigator (usually the first item in the left sidebar).
   - **Select the Target**:
     - Click on your app target (usually named after your project).
   - **Choose a Development Team**:
     - Under the `Signing & Capabilities` tab, find the `Team` dropdown menu.
     - Select your development team (your Apple Developer account).

4. **Set a Unique Bundle Identifier**:

   - **Update Bundle Identifier**:
     - In the same `Signing & Capabilities` tab, ensure the `Bundle Identifier` is unique. It should follow the reverse domain name notation, e.g., `com.yourcompany.yourapp`.

5. **Connect Your Physical Device**:

   - Connect your iOS device to your Mac using a USB cable.
   - **Trust Your Mac**:
     - On your iOS device, you might need to trust the connected Mac. Follow the on-screen prompts to allow this.

6. **Select Your Device in Xcode**:

   - In Xcode, click on the device selection dropdown (near the Play/Run button) and choose your connected iOS device.

7. **Run the Project**:
   - Click the `Run` button (a play icon) in Xcode to build and run your app on the connected device.

### Additional Tips:

- **Automatic Signing**: Ensure that `Automatically manage signing` is checked in the `Signing & Capabilities` tab.
- **React Native Commands**: You can still use React Native CLI commands from your terminal for development, but Xcode is required for initial setup and signing.
- **Debugging**: Use the `Debug` tools in Xcode to troubleshoot any issues that arise when running the app on your device.

### Example Workflow in VSCode and Xcode:

1. **Develop in VSCode**:

   - Continue coding in VSCode as usual.

2. **Build and Run in Xcode**:

   - Whenever you need to test on a physical device, open Xcode, connect your device, and click `Run`.

3. **Switching Back to Simulator**:
   - To switch back to using the simulator, simply select the desired simulator in Xcode’s device dropdown.
