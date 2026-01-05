import { Platform, NativeModules } from 'react-native';

const { VoskRecognizer } = NativeModules;

export class VoskManager {
  private static isInitialized = false;

  static async initialize(modelPath?: string): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Vosk is not available on web');
      return false;
    }

    if (!VoskRecognizer) {
      console.log('Vosk native module not found. Using fallback.');
      return false;
    }

    try {
      const available = await VoskRecognizer.isAvailable();
      if (!available) {
        console.log('Vosk is not available');
        return false;
      }

      if (modelPath) {
        await VoskRecognizer.setupModel(modelPath);
      }
      
      this.isInitialized = true;
      console.log('Vosk initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Vosk:', error);
      return false;
    }
  }

  static async transcribe(audioPath: string): Promise<string | null> {
    if (!this.isInitialized || !VoskRecognizer) {
      console.log('Vosk not initialized or not available');
      return null;
    }

    try {
      const result = await VoskRecognizer.transcribe(audioPath);
      return result;
    } catch (error) {
      console.error('Vosk transcription error:', error);
      return null;
    }
  }

  static isReady(): boolean {
    return this.isInitialized && !!VoskRecognizer;
  }
}
