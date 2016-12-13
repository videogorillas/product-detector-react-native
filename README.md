npm install

export $ANDROID_HOME=...

export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools

react-native run-android

react-native run-ios


== To build .apk: ==

cd android && ./gradlew assembleRelease