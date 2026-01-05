#!/bin/bash

# Common Android SDK locations
POSSIBLE_PATHS=(
  "$HOME/Android/Sdk"
  "$HOME/android/sdk"
  "$HOME/.android/sdk"
  "/usr/local/android-sdk"
  "/opt/android-sdk"
  "$HOME/Library/Android/sdk"
)

# Try to find Android SDK
for path in "${POSSIBLE_PATHS[@]}"; do
  if [ -d "$path" ]; then
    export ANDROID_HOME="$path"
    export ANDROID_SDK_ROOT="$path"
    echo "Found Android SDK at: $ANDROID_HOME"
    break
  fi
done

# If still not found, prompt user
if [ -z "$ANDROID_HOME" ]; then
  echo "Could not auto-detect Android SDK location."
  echo "Please enter the full path to your Android SDK:"
  read -r SDK_PATH
  if [ -d "$SDK_PATH" ]; then
    export ANDROID_HOME="$SDK_PATH"
    export ANDROID_SDK_ROOT="$SDK_PATH"
  else
    echo "Invalid path: $SDK_PATH"
    exit 1
  fi
fi

# Add platform-tools and tools to PATH
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH"

echo "Starting Expo with Android SDK at: $ANDROID_HOME"
npx expo start
