#!/bin/bash

# Step 2: Clean iOS Pods and Reinstall
echo "Cleaning and reinstalling iOS Pods..."
cd ../MyExpenseApp/ios || exit
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
