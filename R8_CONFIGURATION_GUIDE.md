# R8 Configuration & Google Play Compliance Guide

## My-Notebooks-Custom-Themes App - Permission Audit

This document outlines all Android permissions for the My-Notebooks-Custom-Themes app and explains the R8 configuration for Google Play compliance.

---

## App Functionality Summary

My-Notebooks-Custom-Themes is a voice-to-text note-taking app with the following features:
- Voice recording and transcription (via native device speech recognition)
- Text note creation
- Notebook organization with custom colors
- Background image selection for notebooks
- Haptic feedback
- Note sharing

---

## Required Permissions

### 1. RECORD_AUDIO
**Status:** ✅ REQUIRED  
**Purpose:** Core functionality - records user voice for transcription  
**Usage:** `expo-av` Audio.Recording API in `app/notebook/[id].tsx`  
**Justification:** Essential for voice-to-text feature

### 2. READ_EXTERNAL_STORAGE
**Status:** ✅ REQUIRED  
**Purpose:** Allows selecting background images from photo library  
**Usage:** `expo-image-picker` launchImageLibraryAsync in `app/index.tsx` and `app/notebook/[id].tsx`  
**Justification:** Users can customize notebooks with background images

### 3. WRITE_EXTERNAL_STORAGE
**Status:** ✅ REQUIRED  
**Purpose:** Stores recorded audio files temporarily for transcription  
**Usage:** Audio recording creates temporary files that need storage access  
**Justification:** Required for voice recording functionality

### 4. android.permission.VIBRATE
**Status:** ✅ REQUIRED  
**Purpose:** Provides haptic feedback for better UX  
**Usage:** `expo-haptics` throughout the app  
**Justification:** Enhances user experience with tactile feedback

---

## Blocked Permissions

The following permissions are explicitly blocked to ensure Google Play compliance and user privacy:

### 1. CAMERA
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** App does NOT use camera functionality  
**Details:** Only uses image picker to select from gallery, never captures photos  
**Risk:** Google Play may flag unnecessary camera access as privacy violation  
**Action:** Removed from permissions array and added to blockedPermissions

### 2. READ_PHONE_STATE
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App does not need device or phone state information  
**Risk:** Sensitive permission that triggers Google Play policy reviews

### 3. READ_PHONE_NUMBERS
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App has no telephony features  
**Risk:** Accessing phone numbers is a privacy-sensitive operation

### 4. ACCESS_FINE_LOCATION
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App does not use location services  
**Risk:** Location permissions require prominent disclosure

### 5. ACCESS_COARSE_LOCATION
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App does not use location services  
**Risk:** Location permissions require prominent disclosure

### 6. READ_CONTACTS
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App does not access user contacts  
**Risk:** Personal data access requires extensive privacy disclosures

### 7. WRITE_CONTACTS
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for app functionality  
**Details:** App does not modify contacts  
**Risk:** Modifying personal data is high-risk

### 8. ACCESS_NETWORK_STATE
**Status:** ❌ BLOCKED (in app.json blockedPermissions)  
**Reason:** Not required for offline functionality  
**Details:** App uses native device speech recognition, no network checks needed  
**Note:** All transcription happens locally on device

---

## R8/ProGuard Configuration

R8 is enabled for release builds to:
- Reduce APK size through code shrinking
- Obfuscate code for security
- Remove unused resources

### Configuration in app.json

```json
"android": {
  "permissions": [
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "android.permission.VIBRATE",
    "RECORD_AUDIO"
  ],
  "blockedPermissions": [
    "CAMERA",
    "READ_PHONE_STATE",
    "READ_PHONE_NUMBERS",
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "READ_CONTACTS",
    "WRITE_CONTACTS",
    "ACCESS_NETWORK_STATE"
  ],
  "enableProguardInReleaseBuilds": true,
  "enableShrinkResourcesInReleaseBuilds": true,
  "proguardFiles": ["proguard-rules.pro"]
}
```

### Important Rules

See `proguard-rules.pro` for:
- Keep native speech recognition interfaces
- Preserve React Native classes
- Keep Expo module exports
- Preserve expo-image-picker types
- Keep expo-av audio recording classes

---

## Google Play Policy Compliance

### Permissions Declaration
All permissions are declared with clear usage descriptions:
- Microphone: "Allow My-Notebooks-Custom-Themes to access your microphone" (for voice transcription using native device speech recognition)
- Photos: "The app accesses your photos to let you share them with your friends" (for background images)

### Privacy Policy Requirements
App must include privacy policy covering:
- What data is collected (audio recordings, photos)
- How data is used (local transcription via native device speech recognition - NO cloud services)
- Third-party services (None - all processing is local)
- Data retention (local storage only, never transmitted)

### Prominent Disclosure
The app should display permission usage on first launch and in settings.

---

## Testing Checklist

Before submitting to Google Play:

- [ ] Verify CAMERA permission is NOT in AndroidManifest.xml
- [ ] Verify all 8 blocked permissions are in AndroidManifest.xml as blocked
- [ ] Test voice recording works with RECORD_AUDIO
- [ ] Test native speech recognition functions correctly
- [ ] Test image picker works with READ_EXTERNAL_STORAGE
- [ ] Verify no crashes with blocked permissions
- [ ] Test R8 release build runs without errors
- [ ] Verify speech recognition interfaces are not stripped by R8
- [ ] Verify app bundle size is optimized
- [ ] Check for any permission denial errors in logs
- [ ] Confirm privacy policy is accessible in-app

---

## Build Commands

### Local testing with R8:
```bash
npx expo run:android --variant release
```

### Generate release bundle:
```bash
eas build --platform android --profile production
```

---

## Maintenance Notes

**When adding new features:**
1. Review if new permissions are needed
2. Update this document with justifications
3. Add to blockedPermissions if not needed
4. Update privacy policy if collecting new data
5. Test with R8 enabled

**Permission audit schedule:** Review every major release

---

## Contact

For questions about permissions or Google Play compliance:
- Email: morestonetechnologies@gmail.com
- Project: My-Notebooks-Custom-Themes App
- Last Updated: January 5, 2026

---

## Changelog

### January 5, 2026 - R8 Audit & Compliance Fix
- ✅ **CRITICAL:** Removed CAMERA from permissions array
- ✅ Added blockedPermissions array with 8 blocked permissions
- ✅ Added R8 configuration to app.json
- ✅ Updated documentation to reflect native device speech recognition (no external services)
- ✅ Synced all documentation with actual app.json configuration
- ✅ Verified ProGuard rules for native speech recognition
