#!/bin/bash

#!/bin/bash

# Function to print and execute commands
execute() {
  echo "$ $*"
  eval "$@"
}

# Change to the ios directory
execute cd ios

# Remove build directory
execute rm -rf build

# Clean Xcode build
execute xcodebuild clean

# Deintegrate CocoaPods
execute pod deintegrate

# Remove all Cocoapods files
execute rm -rf Pods Podfile.lock

# Install CocoaPods
execute pod install

# Change back to project root directory
execute cd ..

# Remove node_modules directory
execute rm -rf node_modules

# Remove package-lock.json file
execute rm package-lock.json 

# Install npm dependencies
execute npm install

# Remove DerivedData
execute rm -rf ~/Library/Developer/Xcode/DerivedData/

# Remove all watchman watches
execute watchman watch-del-all

# Remove metro cache
execute rm -rf $TMPDIR/metro-*

# Change to ios directory
execute cd ios

# Install CocoaPods with repo update
execute pod install --repo-update

# Change back to project root directory
execute cd ..

# # Start React Native with reset cache
# execute npx react-native start --reset-cache

# Optional: Build the project to ensure everything is set up correctly
echo "Building the project..."
execute npx react-native run-ios


# # Change to ios directory
# cd ios

# # Clean Xcode build
# xcodebuild clean

# # Remove build directory
# rm -rf build

# # Deintegrate CocoaPods
# pod deintegrate

# # Install CocoaPods
# pod install

# # Change back to project root directory
# cd ..

# # Remove node_modules directory
# rm -rf node_modules

# # Remove package-lock.json file
# rm package-lock.json 

# # Install npm dependencies
# npm install

# # Remove DerivedData
# rm -rf ~/Library/Developer/Xcode/DerivedData/

# # Remove all watchman watches
# watchman watch-del-all

# # Remove metro cache
# rm -rf $TMPDIR/metro-*

# # Change to ios directory
# cd ios

# # Install CocoaPods with repo update
# pod install --repo-update

# # Change back to project root directory
# cd ..

# # Start React Native with reset cache
# npx react-native start --reset-cache
