# Vosk Offline Speech-to-Text Setup

## Overview
Vosk provides offline speech recognition for your Voice Notepad app. This guide explains how to complete the setup for production APK builds.

## Native Module Files Created

The following files have been created for the Vosk integration:

1. **utils/VoskManager.ts** - JavaScript interface for Vosk
2. **android/app/src/main/java/app/rork/voice_notepad_app/VoskRecognizerModule.java** - Native module
3. **android/app/src/main/java/app/rork/voice_notepad_app/VoskRecognizerPackage.java** - Package registration

## Android Configuration

### 1. Update `android/app/build.gradle`

Add these dependencies to your `android/app/build.gradle` file:

```gradle
dependencies {
    // ... existing dependencies
    
    implementation 'net.java.dev.jna:jna:5.7.0@aar'
    implementation 'com.alphacephei:vosk-android:0.3.31'
}
```

Also ensure you have mavenCentral in your repositories:

```gradle
repositories {
    mavenCentral()
    // ... other repositories
}
```

### 2. Register the Native Module

In `android/app/src/main/java/app/rork/voice_notepad_app/MainApplication.java` (or `.kt`), add the package:

```java
import app.rork.voice_notepad_app.VoskRecognizerPackage;

// In the getPackages() method:
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new VoskRecognizerPackage()); // Add this line
    return packages;
}
```

### 3. Download Vosk Model

1. Download a Vosk model from https://alphacephei.com/vosk/models
   - Recommended: `vosk-model-small-en-us-0.15` (40 MB)
   - Or: `vosk-model-en-us-0.22` (1.8 GB, more accurate)

2. Extract the model and place it in your app:
   - Option A: Include in APK at `android/app/src/main/assets/vosk-model`
   - Option B: Download on first run and store in app's document directory

### 4. ProGuard Rules

ProGuard rules have been added to `proguard-rules.pro`. Verify these rules exist:

```proguard
-keep class org.vosk.** { *; }
-keep class com.sun.jna.** { *; }
-keep interface org.vosk.** { *; }
-keepclassmembers class org.vosk.** { *; }
-dontwarn org.vosk.**
-dontwarn com.sun.jna.**
-keep class app.rork.voice_notepad_app.VoskRecognizerModule { *; }
-keep class app.rork.voice_notepad_app.VoskRecognizerPackage { *; }
```

## Usage in the App

The notebook screen has been updated to use Vosk with automatic fallback to OpenAI Whisper if Vosk is not available.

### Initialization

In your app's initialization (e.g., `_layout.tsx`):

```typescript
import { VoskManager } from '@/utils/VoskManager';

// Initialize Vosk with model path
useEffect(() => {
  VoskManager.initialize('/path/to/vosk-model').then(success => {
    if (success) {
      console.log('Vosk ready for offline transcription');
    } else {
      console.log('Vosk not available, will use online API');
    }
  });
}, []);
```

## Testing

### Development (Expo Go)
Vosk will NOT work in Expo Go since it requires custom native modules. The app will automatically fall back to OpenAI Whisper API.

### Production APK
After building with `eas build` or direct Android Studio build:
1. Install the APK on a device
2. Test voice recording
3. Check logs to confirm Vosk is being used
4. Test offline functionality by turning off internet

## Model Management

For production apps, consider:

1. **On-demand download**: Download model on first app launch
2. **Compressed storage**: Keep model compressed and extract on first use
3. **Model updates**: Implement a mechanism to update models
4. **Multiple languages**: Allow users to download language packs

## Fallback Strategy

The app implements a smart fallback:

1. Try Vosk (offline) first
2. If Vosk unavailable or fails, use OpenAI Whisper API (online)
3. If both fail, show error to user

## File Sizes

- Small model (en-us): ~40 MB
- Medium model (en-us): ~128 MB  
- Large model (en-us): ~1.8 GB

Choose based on your accuracy requirements and APK size constraints.

## Troubleshooting

### "VoskRecognizer native module not found"
- Ensure the native module is properly registered in MainApplication
- Rebuild the native Android project
- Clear build cache: `cd android && ./gradlew clean`

### "Model not found"
- Verify the model path is correct
- Check file permissions
- Ensure model is properly extracted (not in a subfolder)

### Poor transcription quality
- Use a larger model
- Ensure audio quality is good (16kHz sample rate)
- Check for background noise

### APK size too large
- Use the smallest model that meets your accuracy needs
- Consider on-demand download instead of bundling
- Enable R8/ProGuard minification

## Performance

- Transcription speed: 2-5x real-time (depends on device and model)
- Offline: Works without internet connection
- Privacy: Audio never leaves the device
- Battery: Minimal impact, similar to online API calls
