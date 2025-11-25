# Blueprint: woisenod

## 1. Core Features

*   **Record Audio:** 
    *   Button to start/stop recording.
    *   Visual feedback during recording (e.g., timer, waveform).
*   **Audio Playback:**
    *   List of saved recordings.
    *   Play, pause, and stop functionality.
    *   Seek bar to navigate through the audio.
*   **Local Storage:**
    *   Store audio files and their corresponding captions on the device.
    *   Automatically names recordings sequentially (e.g., "Recording 1", "Recording 2").
    *   Ensure data persistence across sessions.
    *   **Note on Storage Location:** For web-based deployment, we'll use browser storage (`localStorage` or `IndexedDB`), where the browser controls the physical storage location. For native mobile deployment (using Expo), we can use a file system API (`expo-file-system`) to save to directories. On Android, this may include storage locations on an SD card, although the application code itself doesn't get to force this choice; it's managed by the OS.
*   **User Interface:**
    *   Clean and intuitive design.
    *   Responsive layout for different screen sizes.

## 2. Technical Stack

*   **Frontend:**
    *   This is a React Native (Expo) project, so we will use React Native components for the UI.
    *   We will also use **Tamagui** for a unified styling system across web and native.
    *   We will use **react-icons** for icons.
*   **APIs:**
    *   **Audio Recording:** `expo-audio` for audio recording capabilities.
    *   **Audio Playback:** `expo-audio` for audio playback.
    *   **Storage APIs:**
        *   **For Web/Simple Storage:** `AsyncStorage` for key-value pair storage (good for metadata).
        *   **For Native Mobile Files:** `expo-file-system` to save audio files directly to the device's file system, offering more robust storage capabilities.

## 3. Data Model

*   Each voice note will be an object with the following properties:
    *   `id`: Unique identifier (e.g., timestamp).
    *   `fileUri`: The local URI for the saved audio file.
    *   `caption`: The generated text caption. Initially, this will be an automatic name (e.g., "Recording 1"), but it can be renamed by the user.
    *   `createdAt`: Timestamp of when the note was created.

## 4. Development Workflow

1.  **Setup:**
    *   The project is already initialized as a React Native Expo app.
    *   Install necessary dependencies like `expo-audio`.
2.  **Audio Recording:**
    *   Implement the `expo-audio` `Audio.Recording` functionality.
    *   Save the recorded audio to a file using `expo-file-system`.
3.  **Local Storage:**
    *   Use `AsyncStorage` to store the metadata (ID, caption, URI) of the voice notes.
    *   Implement functions to save, retrieve, and delete this metadata, with automatic naming for new recordings.
4.  **Audio Playback:**
    *   Create the UI for listing and playing back recordings.
    *   Use `expo-audio` `Audio.Sound` to load and play the audio from the file URI.
5.  **UI/UX:**
    *   Build out the user interface using React Native components.
    *   Ensure the application is easy to use and visually appealing.
6.  **Testing:**
    *   Thoroughly test all features on both iOS and Android simulators/devices.

## 5. Future Enhancements

*   **Cloud Sync:** Sync voice notes across multiple devices using a cloud service (e.g., Firebase, AWS S3).
*   **Editing Captions:** Allow users to edit the generated captions.
*   **Auto-Captioning:** Utilize a speech-to-text API to generate captions.
*   **Search Functionality:** Implement a search bar to find specific voice notes.
*   **Tags/Categories:** Organize voice notes with tags or categories.
*   **Sharing:** Share voice notes with others.
