# Voice Notepad App - ProGuard Rules for R8 Optimization

# React Native Core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Bridge
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Expo Modules
-keep class expo.modules.** { *; }
-keep class expo.modules.core.** { *; }
-keep interface expo.modules.** { *; }

# expo-image-picker - Required for background image selection
-keep class expo.modules.imagepicker.** { *; }
-keep class expo.modules.imagepicker.ImagePickerModule { *; }
-keep class expo.modules.imagepicker.ImagePickerOptions { *; }

# expo-av - Required for voice recording
-keep class expo.modules.av.** { *; }
-keep class expo.modules.av.audio.** { *; }
-keep class expo.modules.av.player.** { *; }

# expo-haptics - Required for haptic feedback
-keep class expo.modules.haptics.** { *; }

# expo-sharing - Required for note sharing
-keep class expo.modules.sharing.** { *; }

# AsyncStorage - Required for data persistence
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Hermes JavaScript Engine
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# JSC (JavaScriptCore) - Alternative to Hermes
-keep class org.webkit.android.** { *; }

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep Console.log statements for debugging (remove if not needed)
-assumenosideeffects class java.io.PrintStream {
    public void println(%);
    public void println(**);
}

# Gson (if used for JSON serialization)
-keepattributes Signature
-keepattributes *Annotation*
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.** { *; }

# OkHttp (used by Expo for network requests)
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# Keep for proper stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep annotation attributes
-keepattributes *Annotation*

# Keep enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# React Native Navigation (expo-router)
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }

# Image loading libraries
-keep class com.bumptech.glide.** { *; }
-keep class com.squareup.picasso.** { *; }

# Prevent crashes from missing classes
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Optimization settings
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# Attributes to preserve
-keepattributes Exceptions,InnerClasses,Signature,Deprecated,EnclosingMethod

# Voice Notepad App - Custom Models (if any)
# Add your custom data models here to prevent obfuscation
# Example:
# -keep class app.rork.voice_notepad_app.models.** { *; }
