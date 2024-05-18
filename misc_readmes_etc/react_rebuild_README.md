# clean_up.sh

This script will clean up and reinstall dependencies for your iOS project.

```sh
#!/bin/bash

# Step 2: Clean iOS Pods and Reinstall
echo "Cleaning and reinstalling iOS Pods..."
cd ios || exit
pod deintegrate
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..

# Step 3: Clean Xcode Build
echo "Cleaning Xcode build..."
rm -rf ios/build
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData/

# Step 4: Clear Watchman and Metro Cache
echo "Clearing Watchman and Metro cache..."
watchman watch-del-all
rm -rf $TMPDIR/metro-*

# Step 5: Reinstall iOS Pods
echo "Reinstalling iOS Pods..."
cd ios || exit
pod install --repo-update
cd ..

# Step 6: Run the Application
echo "Running the application..."
npx react-native run-ios

echo "Clean up and reinstallation complete."
```

## Usage

1. Make the script executable:

   ```sh
   chmod +x clean_up.sh
   ```

2. Run the script:
   ```sh
   ./clean_up.sh
   ```

## Detailed Steps Included in the Script

1. **Clean iOS Pods and Reinstall**: Deintegrates and removes existing Pods and Podfile.lock, then reinstalls Pods with repo update.
2. **Clean Xcode Build**: Removes the build directory, cleans the Xcode build, and removes Derived Data.
3. **Clear Watchman and Metro Cache**: Clears Watchman watches and removes Metro cache.
4. **Reinstall iOS Pods**: Reinstalls iOS Pods with repo update.
5. **Run the Application**: Runs the React Native application on iOS.

By following these steps, you ensure a clean and fresh state for your iOS project, resolving common issues related to dependencies and caching.
