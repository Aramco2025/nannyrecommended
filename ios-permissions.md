# iOS Info.plist permission strings

After `npx cap add ios` runs on your Mac, open
`ios/App/App/Info.plist` in Xcode and paste these inside the top-level
`<dict>`. Apple rejects generic strings like "We need camera access" —
each must explain the user benefit.

```xml
<key>NSCameraUsageDescription</key>
<string>Take a photo for your profile so parents can see who they're booking.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Choose a profile photo from your photos so parents can see who you are.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save your booking receipts and pickup codes to your photo library.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to show sitters near you and help sitters find jobs in their area.</string>

<key>NSContactsUsageDescription</key>
<string>Find which of your contacts are already on NannyRecommended so you can see who they trust.</string>

<key>NSFaceIDUsageDescription</key>
<string>Unlock the app and confirm sensitive actions with Face ID.</string>

<key>NSUserTrackingUsageDescription</key>
<string>Allow tracking to receive personalised sitter recommendations and improve your experience.</string>
```

## App-bound domains (App Store guideline 2.5.6)

Capacitor sets `limitsNavigationsToAppBoundDomains: true`. Add the
matching `WKAppBoundDomains` array to `Info.plist`:

```xml
<key>WKAppBoundDomains</key>
<array>
  <string>nannyrecommended.com</string>
  <string>www.nannyrecommended.com</string>
</array>
```

## URL schemes (deep links)

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>nannyrecommended</string>
    </array>
  </dict>
</array>
```

## Disable arbitrary loads (better security score)

Capacitor's default is fine. Do **not** add
`NSAllowsArbitraryLoads` — Apple flags it.
