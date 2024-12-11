import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { type CarouselData } from './Item';

export default function Paginator({
  data,
  scrollX,
}: {
  data: CarouselData[];
  scrollX: Animated.Value;
}) {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 32, 10],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#EEEEEE', '#222222', '#EEEEEE'],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i.toString()}
            style={[styles.dot, { width: dotWidth, backgroundColor }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});
