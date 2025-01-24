import {
  type ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video';
import Button from '~/components/ui/Button';
import { useCallback, useState } from 'react';

export interface CarouselData {
  id: number;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

export default function IntroScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const player = useVideoPlayer(
    require('~/assets/video.mp4') as VideoSource,
    (player) => {
      player.loop = true;
      player.play();
      setIsReady(true);
    }
  );

  const routeToSignIn = useCallback(() => {
    player.pause();
    router.navigate('/sign-in');
  }, [player, router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      {isReady && (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          pointerEvents="none"
          nativeControls={false}
        />
      )}
      <Button type="primary" style={styles.button} onPress={routeToSignIn}>
        START
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  carouselContainer: {
    flex: 1,
    gap: 24,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
});
