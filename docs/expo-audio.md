
# Expo Audio (`expo-audio`)

A library that provides an API to implement audio playback and recording in apps.

**Bundled version:** `~1.0.13`

`expo-audio` is a cross-platform audio library for accessing the native audio capabilities of the device.

*Note that audio automatically stops if headphones/bluetooth audio devices are disconnected.*

## Installation

```bash
npx expo install expo-audio
```

If you are installing this in an existing React Native app, make sure to install `expo` in your project.

## Configuration in app config

You can configure `expo-audio` using its built-in config plugin if you use config plugins in your project (EAS Build or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does not use EAS Build, then you'll need to manually configure the package.

### Example `app.json` with config plugin

```json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `microphonePermission` | "Allow $(PRODUCT_NAME) to access your microphone" | **(iOS only)** A string to set the `NSMicrophoneUsageDescription` permission message. |

---

## Usage

### Playing sounds

```jsx
import { View, StyleSheet, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('./assets/Hello.mp3');

export default function App() {
  const player = useAudioPlayer(audioSource);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={() => player.play()} />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

> **Note:** If you're migrating from `expo-av`, you'll notice that `expo-audio` doesn't automatically reset the playback position when audio finishes. After `play()`, the player stays paused at the end of the sound. To play it again, call `seekTo(seconds)` to reset the position — as shown in the example above.

### Recording sounds

```jsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';

export default function App() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={recorderState.isRecording ? stopRecording : record}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

### Playing or recording audio in background (iOS)

On iOS, audio playback and recording in the background is only available in standalone apps and requires extra configuration. You need to add the `audio` key to the `UIBackgroundModes` array in your **Info.plist**.

Example `app.json` to enable background audio:

```json
{
  "expo": {
    ...
    "ios": {
      ...
      "infoPlist": {
        ...
        "UIBackgroundModes": [
          "audio"
        ]
      }
    }
  }
}
```

### Using the AudioPlayer directly

In most cases, the `useAudioPlayer` hook should be used. However, for advanced use cases where you need a player that is not automatically destroyed when a component unmounts, you can create one with `createAudioPlayer`. It is your responsibility to call the `release()` method when the player is no longer needed to avoid memory leaks.

```javascript
import { createAudioPlayer } from 'expo-audio';
const player = createAudioPlayer(audioSource);
```

### Notes on web usage

- A MediaRecorder issue on Chrome produces WebM files missing duration metadata. See the [open Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=642012).
- MediaRecorder encoding options are inconsistent across browsers. Using a polyfill like `kbumsik/opus-media-recorder` or `ai/audio-recorder-polyfill` can improve experience.
- Web browsers require sites to be served securely (HTTPS) to listen to a mic. See [MediaDevices getUserMedia() security](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#security) for details.

---

## API Reference

`import { useAudioPlayer, useAudioRecorder } from 'expo-audio';`

### Constants

#### `Audio.RecordingPresets`
A record containing preset `RecordingOptions`.

- **`HIGH_QUALITY`**:
  ```javascript
  {
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    android: { outputFormat: 'mpeg4', audioEncoder: 'aac' },
    ios: { outputFormat: 'mpeg4aac', audioQuality: 'max', ... },
    web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
  }
  ```
- **`LOW_QUALITY`**:
  ```javascript
  {
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 64000,
    android: { extension: '.3gp', outputFormat: '3gp', audioEncoder: 'amr_nb' },
    ios: { audioQuality: 'min', outputFormat: 'mpeg4aac', ... },
    web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
  }
  ```

### Hooks

- `useAudioPlayer(source, options)`: Creates a managed `AudioPlayer` instance.
- `useAudioPlayerStatus(player)`: Provides real-time playback status for an `AudioPlayer`.
- `useAudioRecorder(options, statusListener)`: Creates a managed `AudioRecorder` instance.
- `useAudioRecorderState(recorder, interval)`: Provides real-time recording state updates.
- `useAudioSampleListener(player, listener)`: Sets up audio sampling for visualization.

### Classes

#### `AudioPlayer`
A class for controlling audio playback.
- **Properties**: `currentTime`, `duration`, `isLoaded`, `playing`, `paused`, `loop`, `muted`, `volume`, etc.
- **Methods**: `play()`, `pause()`, `seekTo()`, `replace()`, `setPlaybackRate()`, `remove()`.

#### `AudioRecorder`
A class for controlling audio recording.
- **Properties**: `currentTime`, `isRecording`, `uri`.
- **Methods**: `prepareToRecordAsync()`, `record()`, `stop()`, `pause()`, `getAvailableInputs()`, `getStatus()`.

### Methods

- `Audio.createAudioPlayer(source, options)`: Creates an unmanaged `AudioPlayer`.
- `Audio.getRecordingPermissionsAsync()`: Checks recording permissions without prompting.
- `Audio.requestRecordingPermissionsAsync()`: Prompts the user for recording permissions.
- `Audio.setAudioModeAsync(mode)`: Configures global audio session settings.
- `Audio.setIsAudioActiveAsync(active)`: Globally enables or disables the audio subsystem.

---
*For a more detailed API reference including all types, properties, and enums, please refer to the official Expo documentation.*
