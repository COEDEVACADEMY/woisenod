
import 'react-native-get-random-values';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, View, Slider, Paragraph } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { FlatList, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RenamePrompt } from '@/components/rename-prompt';

interface Recording {
    id: string;
    fileUri: string;
    caption: string;
    createdAt: string;
}

export default function StorageScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Recording | null>(null);
  const [promptVisible, setPromptVisible] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  async function loadRecordings() {
    try {
      const existingRecordings = await AsyncStorage.getItem('recordings')
      const recordings = existingRecordings ? JSON.parse(existingRecordings) : [];
      setRecordings(recordings.sort((a: Recording, b: Recording) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load recordings', error);
      await AsyncStorage.setItem('recordings', JSON.stringify([]));
      setRecordings([]);
    }
  }

  useEffect(() => {
    loadRecordings();
    const interval = setInterval(loadRecordings, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (playerStatus.isLoaded && !playerStatus.playing && currentlyPlaying) {
        if(playerStatus.currentTime >= playerStatus.duration) {
            setCurrentlyPlaying(null);
        }
    }
}, [playerStatus]);

  function playSound(recording: Recording) {
    console.log('Replacing and playing sound:', recording.fileUri);
    try {
      player.replace(recording.fileUri);
      player.play();
      setCurrentlyPlaying(recording);
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  }

  async function deleteRecording(id: string) {
      try {
        const existingRecordings = await AsyncStorage.getItem('recordings');
        const recordings = existingRecordings ? JSON.parse(existingRecordings) : [];
        const updatedRecordings = recordings.filter((r: Recording) => r.id !== id);
        await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
        loadRecordings();
      } catch (error) {
          console.error('Failed to delete recording', error);
      }
  }

  async function shareRecording(uri: string) {
    try {
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Failed to share recording', error);
    }
  }

  async function renameRecording(newCaption: string) {
    if (selectedRecording && newCaption) {
      try {
        const existingRecordings = await AsyncStorage.getItem('recordings');
        const recordings = existingRecordings ? JSON.parse(existingRecordings) : [];
        const updatedRecordings = recordings.map((r: Recording) => {
          if (r.id === selectedRecording.id) {
            return { ...r, caption: newCaption };
          }
          return r;
        });
        await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
        loadRecordings();
      } catch (error) {
        console.error('Failed to rename recording', error);
      }
    }
  }

  const renderItem = ({ item }: { item: Recording }) => (
    <ThemedView style={styles.recordingContainer} lightColor="#fff" darkColor="#2a2a2a">
      <View>
          <ThemedText type="subtitle">{item.caption}</ThemedText>
          <ThemedText type="defaultSemiBold">{new Date(item.createdAt).toLocaleString()}</ThemedText>
      </View>
      <View style={styles.buttonContainer}>
          <Button onPress={() => playSound(item)} theme="blue">
              <IconSymbol name="play.circle" />
          </Button>
          <Button onPress={() => deleteRecording(item.id)} theme="red">
              <IconSymbol name="trash" />
          </Button>
          <Button onPress={() => shareRecording(item.fileUri)} theme="green">
              <IconSymbol name="square.and.arrow.up" />
          </Button>
          <Button 
            onPress={() => {
              setSelectedRecording(item);
              setPromptVisible(true);
            }}
            theme="yellow">
              <IconSymbol name="pencil" />
          </Button>
      </View>
  </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Recordings</ThemedText>
      {recordings.length === 0 ? (
        <ThemedText>There's no recording yet</ThemedText>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
        />
      )}

      {currentlyPlaying && playerStatus.isLoaded && (
        <ThemedView style={styles.playerWidget} lightColor="#f0f0f0" darkColor="#1e1e1e">
          <ThemedText>{currentlyPlaying.caption}</ThemedText>
          <Slider
            defaultValue={[0]}
            value={[playerStatus.currentTime]}
            max={playerStatus.duration}
            onValueChange={([value]) => player.seekTo(value)}
            width="100%"
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb circular index={0} />
          </Slider>
          <View style={styles.timeContainer}>
            <Paragraph>{new Date(playerStatus.currentTime).toISOString().substr(14, 5)}</Paragraph>
            <Paragraph>{new Date(playerStatus.duration).toISOString().substr(14, 5)}</Paragraph>
          </View>
        </ThemedView>
      )}
      {selectedRecording && (
        <RenamePrompt
            visible={promptVisible}
            defaultValue={selectedRecording.caption}
            onClose={() => {
                setPromptVisible(false);
                setSelectedRecording(null);
            }}
            onRename={renameRecording}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  recordingContainer: {
    padding: 16,
    borderRadius: 10,
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  playerWidget: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    gap: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
