
import 'react-native-get-random-values';
import { useState, useEffect } from 'react';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Button } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Alert, StyleSheet, Image } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { Mic, Square } from '@tamagui/lucide-icons';

export default function HomeScreen() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    (async () => {
      const status = await requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  async function startRecording() {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
    } catch (err: any) {
      console.error("Failed to start recording", err);
      let errorMessage = 'An unknown error occurred while trying to start the recording.';
      if (typeof err === 'object' && err !== null) {
        errorMessage = `Error: ${err.message || 'No message'}\nCode: ${err.code || 'No code'}\nStack: ${err.stack || 'No stack'}`;
      } else if (err) {
        errorMessage = String(err);
      }
      Alert.alert('Failed to Start Recording', errorMessage);
    }
  }

  async function stopRecording() {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (uri) {
        const caption = "My Recording";
        console.log('Recording stopped and stored at', uri);
        const existingRecordings = await AsyncStorage.getItem('recordings');
        const recordings = existingRecordings ? JSON.parse(existingRecordings) : [];
        const newRecording = {
          id: uuidv4(),
          fileUri: uri,
          caption: caption,
          createdAt: new Date().toISOString(),
        };
        const updatedRecordings = [...recordings, newRecording];
        await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
        Alert.alert('Recording Saved', `Saved as "${caption}"`);
      }   } catch (error) {
      console.error('Failed to save recording metadata', error);
      Alert.alert('Error', 'Failed to save recording.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <ThemedText type="title">Voice Recorder</ThemedText>
      <Button
        size="$5"
        onPress={recorderState.isRecording ? stopRecording : startRecording}
        icon={recorderState.isRecording ? <Square /> : <Mic />}
        theme={recorderState.isRecording ? "red" : "blue"}
      >
        {recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <ThemedText style={styles.timerText}>{new Date(recorderState.durationMillis).toISOString().substr(11, 8)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  timerText: {
    fontSize: 24,
    fontVariant: ['tabular-nums'],
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  }
});
