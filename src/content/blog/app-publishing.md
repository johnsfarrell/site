---
title: "Flutter App Publishing"
description: "Guides to uploading apps on both the App Store and Google Play Store."
pubDate: "August 19, 2024"
---

Once you have finished building your Flutter app, it is time to publish it! Below are guides for publishing to both the App Store and the Google Play Store.

<hr>

## Publish to App Store

**Prerequisites**: review [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and enroll in [Apple Developer Program](https://developer.apple.com/programs/)

### 1. Register Bundle ID

The Bundle ID is a unique identifier for the iOS app. Bundle IDs generally follow reverse domain name notation.

#### Steps:

1. Go to Apple Developer page.
2. Navigate to **Certificate, IDs, and Profiles** → **Identifiers**.
3. Complete the form for the app information.

### 2. Create a Record in App Store Connect

Create a record in App Store Connect for the app.

#### Steps:

1. Go to Apple Developer page.
2. Navigate to **App Store Connect** → **Apps**.
3. Create a **New App** and fill in the details for the app.
4. Select the Bundle ID registered in Step 1.

### 3. Modify Xcode Settings

#### General Settings

1. In Xcode, navigate to the **Runner**.
2. Update the following settings under **General**:
   - Choose a minimum iOS version.
   - Choose a display name and set the Bundle ID to the ID registered in Step 1.

#### App Icon Location

1. In Xcode, navigate to **Assets** under the **Runner** project.
2. Upload a 1024x1024 image as "AppIcon" or the name given in Step 2.

#### Signing & Capabilities

1. Signing ensures to the user that the app is not tampered with.
2. Ensure **automatically managed signing** is enabled.
3. Specify the team that is publishing the app.

### 4. Update Build Version

Apple uses a [`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion) to version the number.

#### Steps:

1. Set `pubspe3.yaml` `version` field to `1.0.0` for the initial release.

### 5. Create a Build Archive

#### Steps:

1. Run `flutter build ios --release` - builds `.app`.
2. Run `flutter build ipa` - builds `.ipa`, required to distribute on the App Store.
3. Find the `.ipa` file under the `build/ios/ipa` directory.

### 6. Upload App

#### Steps:

1. Download the [Apple Transporter App for Mac](https://apps.apple.com/us/app/transporter/id1450874784).
2. Upload & deliver the `.ipa` file from Step 5 to App Store Connect.
3. In App Store Connect, add for review on the App Store.
   - Additionally, can add for beta review in [TestFlight](https://developer.apple.com/testflight/).

<hr>

## Publish to Google Play Store

**Prerequisites**: register as a [Google Developer](https://play.google.com/console/signup), review [Flutter Android Deployment](https://docs.flutter.dev/deployment/android), and create a Terms of Service (TOS) document.

### 1. Set an App Icon

App icons are essential for brand identity and should follow Google's guidelines.

#### Steps:

1. Use an icon generator like **IconKitchen** to create the app icon.
2. Add a 256x256 PNG image under the `/assets` directory.
3. Add the latest version of **Launch Icons** to `dev_dependencies` in `pubspec.yaml`.
4. Add a `flutter_icons` key in `pubspec.yaml` with the following configuration:
   - Set `image_path` to the path of the icon created in Step 1.
   - Set `android` to `true`.
   - Set `ios` to `false`.
5. Run `flutter pub get` to download the Launch Icons package.
6. Run `flutter pub run flutter_launcher_icons` to generate Android app icons.

### 2. Set an App Name

The app name is defined in the manifest file, which contains metadata for the application.

#### Steps:

1. Navigate to `android/app/src/main/AndroidManifest.xml`.
2. Set the value of `android:label` to the desired application name.
3. Navigate to `android/app/build.gradle`.
4. Set the `applicationId` in the `defaultConfig` map to the Bundle ID used for the iOS version.

### 3. Sign the App

Signing your app ensures that it is secure and can be trusted by users.

#### Steps:

1. Copy and paste the following code into `android/key.properties`:

   ```properties
   storePassword=<your_store_password>
   keyPassword=<your_key_password>
   keyAlias=<your_key_alias>
   storeFile=<path_to_your_keystore_file>
   ```

2. Create and upload a keystore using the following commands:

   ```bash
   keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias <your_key_alias>
   ```

3. Locate the created `upload-keystore.jks` file and move it to the `android/app` directory.
4. Specify the path to the keystore in `key.properties`, e.g., `storeFile=../app/upload-keystore.jks`.
5. Copy the signing configuration code into `build.gradle` under the `android` block. Ensure you do not overwrite any existing configurations.

6. Run the following command to generate a release build:

   ```bash
   flutter build appbundle --release
   ```

### 4. Create an App in Google Play Console

Create an entry for your app in the Google Play Console.

#### Steps:

1. Navigate to the [Google Play Console](https://play.google.com/console).
2. Create a new app from the Home page.
3. Provide the necessary app information under **Grow** → **Store Presence** → **Main Store Listing**.
4. Fill in the developer information under **Grow** → **Store Presence** → **Store Settings**.

### 5. Create a Release

Publishing a release makes your app available to users on Google Play.

#### Steps:

1. Navigate to **Release** → **Production** in the Google Play Console.
2. Create a new release and follow the on-screen instructions.
3. Upload the `.aab` file generated in Step 3g.
4. Navigate to **Policy** → **App Content** and complete all required declarations.

### 6. Send for Review

Submit your app for review to be listed on the Google Play Store.

#### Steps:

1. Navigate to **Release** → **Releases Overview** in the Google Play Console.
2. Confirm all declarations are filled out.
3. Save the changes and submit the app for review.

<hr>

## More Resources

- [App Store Review Overview](https://developer.apple.com/distribute/app-review/)
- [Android App Store Deployment](https://docs.flutter.dev/deployment/android)
- [Apple: Distributing Custom Apps](https://developer.apple.com/custom-apps)
- [Apple: Alternative App Icons](https://developer.apple.com/documentation/xcode/configuring_your_app_to_use_alternate_app_icons)
- [Google: Android Private Apps](https://support.google.com/a/answer/2494992)
