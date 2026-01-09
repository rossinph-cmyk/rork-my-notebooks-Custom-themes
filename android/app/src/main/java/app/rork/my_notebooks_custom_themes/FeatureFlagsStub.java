package app.rork.my_notebooks_custom_themes;

import android.util.Log;

/**
 * Stub class to prevent React Native from loading libreact_featureflagsjni.so
 * This must be loaded BEFORE any React Native classes are initialized
 */
public class FeatureFlagsStub {
    private static final String TAG = "FeatureFlagsStub";
    private static boolean initialized = false;

    public static void init() {
        if (initialized) {
            return;
        }
        
        try {
            Log.d(TAG, "Initializing feature flags stub...");
            
            // Try to prevent the native library from being loaded
            // by preemptively registering a dummy version
            System.setProperty("react.featureflags.disabled", "true");
            
            Log.d(TAG, "Feature flags stub initialized successfully");
            initialized = true;
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize feature flags stub", e);
        }
    }
}
