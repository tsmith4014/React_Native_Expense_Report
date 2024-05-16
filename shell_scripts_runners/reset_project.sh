#!/bin/bash

# Change to ios directory
cd ios

# Clean Xcode build
xcodebuild clean

# Remove build directory
rm -rf build

# Deintegrate CocoaPods
pod deintegrate

# Install CocoaPods
pod install

# Change back to project root directory
cd ..

# Remove node_modules directory
rm -rf node_modules

# Remove package-lock.json file
rm package-lock.json 

# Install npm dependencies
npm install

# Remove DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/

# Remove all watchman watches
watchman watch-del-all

# Remove metro cache
rm -rf $TMPDIR/metro-*

# Change to ios directory
cd ios

# Install CocoaPods with repo update
pod install --repo-update

# Change back to project root directory
cd ..

# Start React Native with reset cache
npx react-native start --reset-cache
