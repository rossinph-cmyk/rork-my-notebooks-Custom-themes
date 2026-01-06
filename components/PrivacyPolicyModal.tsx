import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { ShieldCheck, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onAccept: () => void;
}

export default function PrivacyPolicyModal({ visible, onAccept }: PrivacyPolicyModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAccept = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAccept();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <View style={styles.header}>
          <ShieldCheck size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>MoreStoneTechnologies Voice Notepad</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.section}>
            <Text style={styles.effectiveDate}>Effective Date: December 11, 2025</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Us</Text>
            <Text style={styles.paragraph}>
              MoreStoneTechnologies provides Voice Notepad, a voice-to-text note-taking application.
            </Text>
            <Text style={styles.paragraph}>
              Email: Moorestonetechnologies@gmail.com
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>1.1 Information You Provide</Text>
            <Text style={styles.paragraph}>
              • Voice Recordings: Processed locally on your device. We do not transmit or store your voice recordings.
            </Text>
            <Text style={styles.paragraph}>
              • Text Notes: Stored locally on your device.
            </Text>
            <Text style={styles.paragraph}>
              • Photos/Images: Custom backgrounds you select are stored locally on your device.
            </Text>

            <Text style={styles.subsectionTitle}>1.2 Automatically Collected Information</Text>
            <Text style={styles.paragraph}>
              • Device information (model, operating system)
            </Text>
            <Text style={styles.paragraph}>
              • Anonymous usage data to improve app functionality
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              • Voice transcription (processed locally)
            </Text>
            <Text style={styles.paragraph}>
              • Local storage of your notes and settings
            </Text>
            <Text style={styles.paragraph}>
              • App functionality and performance improvements
            </Text>
            <Text style={styles.paragraph}>
              • Service quality enhancement based on usage patterns
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Permissions We Request</Text>
            
            <Text style={styles.subsectionTitle}>3.1 Microphone Access</Text>
            <Text style={styles.paragraph}>
              Required for voice recording and transcription features.
            </Text>

            <Text style={styles.subsectionTitle}>3.2 Photo Library Access</Text>
            <Text style={styles.paragraph}>
              Allows you to select custom background images for notebooks.
            </Text>

            <Text style={styles.subsectionTitle}>3.3 Storage Access</Text>
            <Text style={styles.paragraph}>
              Needed to save your notes and app data locally on your device.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Sharing</Text>
            
            <Text style={styles.subsectionTitle}>4.1 Voice Processing</Text>
            <Text style={styles.paragraph}>
              Voice recordings are processed locally on your device using your phone&apos;s native speech recognition. No data is transmitted to external servers.
            </Text>

            <Text style={styles.subsectionTitle}>4.2 Future Advertising Partners (Not Currently Active)</Text>
            <Text style={styles.paragraph}>
              In the future, we may integrate advertising services. When implemented, we will provide notice and update this policy.
            </Text>

            <Text style={styles.subsectionTitle}>4.3 We Do Not Sell Your Data</Text>
            <Text style={styles.paragraph}>
              We do not sell, rent, or trade your personal information to third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Future Features</Text>
            
            <Text style={styles.subsectionTitle}>5.1 Premium Subscription (Planned)</Text>
            <Text style={styles.paragraph}>
              Future premium features may require payment processing. We will use secure third-party payment processors.
            </Text>

            <Text style={styles.subsectionTitle}>5.2 Advertisements (Planned)</Text>
            <Text style={styles.paragraph}>
              We may introduce ads in future versions. Ad partners will be disclosed when implemented.
            </Text>

            <Text style={styles.subsectionTitle}>5.3 Cloud Sync (Planned)</Text>
            <Text style={styles.paragraph}>
              Optional cloud backup and sync may be added. This will require explicit consent and account creation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Security</Text>
            <Text style={styles.paragraph}>
              • Local Storage: Your notes are stored locally on your device using iOS secure storage mechanisms.
            </Text>
            <Text style={styles.paragraph}>
              • No Account Required: No login means no password vulnerabilities.
            </Text>
            <Text style={styles.paragraph}>
              • Local Processing: Voice data stays on your device and is not transmitted.
            </Text>
            <Text style={styles.paragraph}>
              • Device Security: Your data security relies on your device&apos;s security features (passcode, biometric authentication).
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Data Retention</Text>
            <Text style={styles.paragraph}>
              • Local Data: Persists on your device until you delete the app or manually delete notes.
            </Text>
            <Text style={styles.paragraph}>
              • Voice Recordings: Processed locally on your device, never transmitted or stored by us.
            </Text>
            <Text style={styles.paragraph}>
              • App Deletion: All local data is removed when you uninstall the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Sharing and Exporting Your Notes</Text>
            
            <Text style={styles.subsectionTitle}>8.1 User-Initiated Sharing</Text>
            <Text style={styles.paragraph}>
              Voice Notepad allows you to share your notes using your device&apos;s native sharing functionality. When you choose to share:
            </Text>
            <Text style={styles.paragraph}>
              • Sharing is entirely voluntary and initiated by you
            </Text>
            <Text style={styles.paragraph}>
              • You control which notes to share and with whom
            </Text>
            <Text style={styles.paragraph}>
              • The app does not automatically share any of your data
            </Text>

            <Text style={styles.subsectionTitle}>8.2 Third-Party Platforms</Text>
            <Text style={styles.paragraph}>
              When you share notes through third-party apps (such as Gmail, Facebook Messenger, WhatsApp, SMS, or other messaging/social platforms), you are using those platforms&apos; services directly:
            </Text>
            <Text style={styles.paragraph}>
              • Your shared content is subject to the privacy policies of those third-party platforms
            </Text>
            <Text style={styles.paragraph}>
              • We do not control or have access to data you share through third-party platforms
            </Text>
            <Text style={styles.paragraph}>
              • We recommend reviewing the privacy policies of any platforms you use for sharing
            </Text>

            <Text style={styles.subsectionTitle}>8.3 What Gets Shared</Text>
            <Text style={styles.paragraph}>
              When you use the share feature, only the text content of the selected note is shared. We do not share:
            </Text>
            <Text style={styles.paragraph}>
              • Voice recordings
            </Text>
            <Text style={styles.paragraph}>
              • Device information
            </Text>
            <Text style={styles.paragraph}>
              • Personal identifiers
            </Text>
            <Text style={styles.paragraph}>
              • Usage data
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Your Rights</Text>
            <Text style={styles.paragraph}>
              • Access: View all your notes locally within the app.
            </Text>
            <Text style={styles.paragraph}>
              • Deletion: Delete individual notes or entire notebooks at any time.
            </Text>
            <Text style={styles.paragraph}>
              • Control Permissions: Manage app permissions through your device settings.
            </Text>
            <Text style={styles.paragraph}>
              • Data Portability: Export and share your notes as plain text via the sharing feature.
            </Text>
            <Text style={styles.paragraph}>
              • Privacy: Voice features are processed locally on your device with no external transmission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Children&apos;s Privacy</Text>
            <Text style={styles.paragraph}>
              Voice Notepad is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. International Users</Text>
            <Text style={styles.paragraph}>
              Voice Notepad processes all voice data locally on your device. No data is transferred internationally.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Changes to This Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy periodically. Changes will be communicated through the app. Continued use after changes constitutes acceptance of the updated policy.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </Text>
            <Text style={styles.paragraph}>
              Moorestonetechnologies@gmail.com
            </Text>
          </View>

          <View style={styles.consentBox}>
            <Text style={styles.consentText}>
              By tapping &quot;Accept and Continue&quot; below, you acknowledge that you have read, understood, and agree to this Privacy Policy.
            </Text>
          </View>
        </ScrollView>

        {!hasScrolledToBottom && (
          <View style={styles.scrollIndicator}>
            <ChevronDown size={24} color="#2563EB" />
            <Text style={styles.scrollHint}>Please scroll to read the full policy</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.acceptButton, !hasScrolledToBottom && styles.acceptButtonDisabled]}
            onPress={handleAccept}
            disabled={!hasScrolledToBottom}
          >
            <Text style={[styles.acceptButtonText, !hasScrolledToBottom && styles.acceptButtonTextDisabled]}>
              Accept and Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  effectiveDate: {
    fontSize: 14,
    fontStyle: 'italic' as const,
    color: '#6B7280',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1F2937',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 8,
  },
  consentBox: {
    marginTop: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  consentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
    fontWeight: '600' as const,
  },
  scrollIndicator: {
    position: 'absolute' as const,
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  scrollHint: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 4,
    fontWeight: '600' as const,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  acceptButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  acceptButtonTextDisabled: {
    color: '#E5E7EB',
  },
});
