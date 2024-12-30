import { StyleSheet, View, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useCallback, useState } from 'react';

const horizontalPadding = 32; // 16px on each side
const containerWidth = Dimensions.get('window').width - horizontalPadding;
const videoHeight = (containerWidth / 16) * 9;

interface Props {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
}

export default function VideoPlayer({
  videoId,
  startSeconds,
  endSeconds,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      setKey((prev) => prev + 1);
      setPlaying(true);
    }
  }, []);

  return (
    <View>
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        <YoutubePlayer
          key={key}
          height={videoHeight}
          videoId={videoId}
          webViewStyle={{ flex: 1 }}
          initialPlayerParams={{ start: startSeconds, end: endSeconds }}
          play={playing}
          onChangeState={onStateChange}
          volume={0}
          mute={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
