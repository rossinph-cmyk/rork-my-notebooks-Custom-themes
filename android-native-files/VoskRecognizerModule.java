package app.rork.voice_notepad_app;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.json.JSONObject;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

public class VoskRecognizerModule extends ReactContextBaseJavaModule {
    private Model model;
    private static final int SAMPLE_RATE = 16000;

    public VoskRecognizerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VoskRecognizer";
    }

    @ReactMethod
    public void isAvailable(Promise promise) {
        try {
            promise.resolve(true);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void setupModel(String modelPath, Promise promise) {
        try {
            File modelFile = new File(modelPath);
            if (!modelFile.exists()) {
                promise.reject("MODEL_NOT_FOUND", "Model file not found at path: " + modelPath);
                return;
            }
            
            model = new Model(modelPath);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("SETUP_ERROR", "Failed to setup model: " + e.getMessage());
        }
    }

    @ReactMethod
    public void transcribe(String audioPath, Promise promise) {
        if (model == null) {
            promise.reject("MODEL_NOT_INITIALIZED", "Model not initialized. Call setupModel first.");
            return;
        }

        try {
            File audioFile = new File(audioPath);
            if (!audioFile.exists()) {
                promise.reject("AUDIO_NOT_FOUND", "Audio file not found");
                return;
            }

            Recognizer recognizer = new Recognizer(model, SAMPLE_RATE);
            
            FileInputStream fis = new FileInputStream(audioFile);
            byte[] buffer = new byte[4096];
            int bytesRead;
            
            while ((bytesRead = fis.read(buffer)) != -1) {
                recognizer.acceptWaveForm(buffer, bytesRead);
            }
            
            fis.close();
            
            String result = recognizer.getFinalResult();
            recognizer.close();
            
            JSONObject jsonResult = new JSONObject(result);
            String text = jsonResult.optString("text", "");
            
            promise.resolve(text);
        } catch (Exception e) {
            promise.reject("TRANSCRIPTION_ERROR", "Failed to transcribe: " + e.getMessage());
        }
    }
}
