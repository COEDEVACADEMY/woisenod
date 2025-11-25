# Woisenod: Voice Note App

This is a voice note-taking application built with Expo and React Native. It allows users to record, play back, and auto-caption audio notes.

## Core Features

*   **Record Audio:** Start and stop audio recordings with visual feedback.
*   **Audio Playback:** Listen to saved recordings with play, pause, and stop controls.
*   **Auto-Captioning:** Automatically generate captions for your recordings using a speech-to-text API.
*   **Local Storage:** Store audio files and captions on your device for offline access.

## Technical Stack

*   **Frontend:** React Native (Expo) and Tamagui for styling.
*   **Audio:** `expo-audio` for recording and playback.
*   **Storage:** `AsyncStorage` and `expo-file-system` for local data persistence.

## Getting Started

1.  **Install dependencies:** `npm install`
2.  **Run on Android:** `npm run android -- --tunnel`
3.  **Run on Web:** `npm run web`

## API Documentation

This project uses the `expo-audio` library for handling audio recording and playback. For more detailed information, please refer to the [expo-audio documentation](docs/expo-audio.md).

## Future Enhancements

*   Cloud sync for backing up and syncing notes across devices.
*   Ability to edit captions.
*   Search functionality to find specific notes.
*   Tags and categories for organizing notes.
*   Sharing notes with others.
