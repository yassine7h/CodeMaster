#!/bin/bash


echo "Downloading Android SDK Command-Line Tools..."
mkdir -p $ANDROID_SDK_DIR/cmdline-tools
wget $CMDLINE_TOOLS_URL -O cmdline-tools.zip
unzip cmdline-tools.zip -d $ANDROID_SDK_DIR/cmdline-tools
mv $ANDROID_SDK_DIR/cmdline-tools/cmdline-tools $ANDROID_SDK_DIR/cmdline-tools/latest
rm cmdline-tools.zip

# Step 3: Set up environment variables
echo "Setting up environment variables..."
PROFILE_FILE="$HOME/.bashrc"
{
  echo "export ANDROID_HOME=$ANDROID_SDK_DIR"
  echo "export ANDROID_SDK_ROOT=$ANDROID_SDK_DIR"
  echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/emulator:\$ANDROID_HOME/platform-tools"
  echo "export PATH=\$ANDROID_HOME/cmdline-tools/latest/bin:\$PATH"
} >> $PROFILE_FILE
source $PROFILE_FILE

# Step 4: Install SDK components
echo "Installing Android SDK components..."
sdkmanager --update
sdkmanager "platform-tools" "emulator" "platforms;android-33" "system-images;android-33;google_apis;x86_64"


# Step 6: Create an Android Virtual Device (AVD)
echo "Creating Android Virtual Device..."
avdmanager create avd -n my_emulator -k "system-images;android-33;google_apis;x86_64" -d pixel

# Step 7: Instructions for user
echo "-------------------------------------------------"
echo "Android Emulator setup is complete!"
echo "Please log out and log back in to apply KVM group changes."
echo "To start the emulator, run the following command:"
echo "emulator -avd my_emulator"
echo "-------------------------------------------------"
