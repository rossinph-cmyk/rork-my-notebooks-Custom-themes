# ==========================================================================
# React Native 0.81.5 R8 Compatibility - PATCHED
# ==========================================================================
# React Native 0.81.5 is missing libreact_featureflagsjni.so which causes
# crashes when R8 minification is enabled. 
#
# SOLUTION IMPLEMENTED:
# Patched node_modules files to bypass the missing JNI library:
# 1. node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/internal/featureflags/ReactNativeFeatureFlagsCxxInterop.kt
#    - Commented out SoLoader.loadLibrary("react_featureflagsjni")
#    - Replaced all external JNI functions with stub implementations returning safe defaults
# 2. node_modules/expo-modules-core/android/src/main/java/expo/modules/rncompatibility/ReactNativeFeatureFlags.kt
#    - Removed import of com.facebook.react.internal.featureflags.ReactNativeFeatureFlags
#    - Changed enableBridgelessArchitecture to return hardcoded false
#
# IMPORTANT: These patches must be reapplied after running npm install
# ==========================================================================

# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

# Keep all React Native classes - NO OBFUSCATION
-keep,includedescriptorclasses class com.facebook.react.** { *; }
-keep,includedescriptorclasses class com.facebook.jni.** { *; }
-keep,includedescriptorclasses class com.facebook.hermes.** { *; }
-keep,includedescriptorclasses class com.facebook.soloader.** { *; }
-keep,includedescriptorclasses class com.facebook.yoga.** { *; }

# Keep our stub feature flags implementation
-keep class com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsCxxInterop { *; }

# Keep SoLoader - CRITICAL
-keep class com.facebook.soloader.SoLoader { *; }
-keep class com.facebook.soloader.** { *; }
-keepclassmembers class com.facebook.soloader.** { *; }

# Disable obfuscation completely for React Native
-dontobfuscate

# Keep Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep TurboModules
-keep class com.facebook.react.turbomodule.** { *; }
-keep interface com.facebook.react.turbomodule.** { *; }

# Keep ReactNativeHost
-keepclassmembers class * implements com.facebook.react.ReactApplication {
  com.facebook.react.ReactNativeHost getReactNativeHost();
}

# Keep native methods - ENHANCED JNI SUPPORT
-keepclassmembers class * {
    native <methods>;
}
-keepclasseswithmembers class * {
    native <methods>;
}
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep BuildConfig
-keep class **.BuildConfig { *; }

# Expo Modules
-keep class expo.modules.** { *; }
-keep interface expo.modules.** { *; }
-keepattributes *Annotation*

# Keep ApplicationLifecycleDispatcher
-keep class expo.modules.ApplicationLifecycleDispatcher { *; }

# Keep ReactNativeFeatureFlags and related classes - CRITICAL FOR JNI
-keep,includedescriptorclasses class com.facebook.react.internal.featureflags.** { *; }
-keep,includedescriptorclasses class expo.modules.rncompatibility.** { *; }
-keepclasseswithmembers,includedescriptorclasses class * {
    native <methods>;
}
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# Keep all JNI related classes
-keep class com.facebook.jni.** { *; }
-keep,includedescriptorclasses class * {
    native <methods>;
}

# Keep React Native New Architecture
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.defaults.** { *; }

# Keep ReactActivity and delegates
-keep class com.facebook.react.ReactActivity { *; }
-keep class com.facebook.react.ReactActivityDelegate { *; }
-keep class expo.modules.ReactActivityDelegateWrapper { *; }

# Don't warn about missing classes
-dontwarn com.facebook.react.**
-dontwarn expo.modules.**
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.jni.**
-dontwarn coil3.PlatformContext

# Keep all enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep source file names and line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
