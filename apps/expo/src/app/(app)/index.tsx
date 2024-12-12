import {
  Animated,
  FlatList,
  Image,
  type ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import colors from '~/lib/utils/colors';
import Button from '~/components/ui/Button';
import { useRef, useState } from 'react';
import IntroItem from '~/components/intro/Item';
import Paginator from '~/components/intro/Paginator';
import { useRouter } from 'expo-router';
import { RadialGradient } from 'react-native-gradients';

export interface CarouselData {
  id: number;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

const colorList = [
  { offset: '0%', color: colors.beige, opacity: '1' },

  { offset: '100%', color: 'white', opacity: '1' },
];

export default function IntroScreen() {
  const { t } = useTranslation();
  const carouselData: CarouselData[] = [
    {
      id: 1,
      image: require('~/assets/adscreen1.png'),
      title: t('intro.title1'),
      subtitle: t('intro.subTitle1'),
    },
    {
      id: 2,
      image: require('~/assets/adscreen2.png'),
      title: t('intro.title2'),
      subtitle: t('intro.subTitle2'),
    },
    {
      id: 3,
      image: require('~/assets/adscreen3.png'),
      title: t('intro.title3'),
      subtitle: t('intro.subTitle3'),
    },
  ];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: {
        item: CarouselData;
        key: string;
        index: number | null;
        isViewable: boolean;
      }[];
    }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].item.id - 1);
      }
    }
  ).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    if (index < carouselData.length) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const routeToSignIn = () => {
    router.navigate('/sign-in');
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image
          source={carouselData[currentIndex]?.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <View style={styles.gradientContainer}>
          <RadialGradient
            x="50%"
            y="50%"
            rx="50%"
            ry="50%"
            colorList={colorList}
          />
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            renderItem={({ item }) => <IntroItem item={item} />}
            bounces={false}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
          />
          <Paginator data={carouselData} scrollX={scrollX} />
        </View>
        <View style={styles.buttonContainer}>
          <Button type="secondary" onPress={routeToSignIn}>
            {t('intro.skip')}
          </Button>
          <Button
            onPress={() => {
              if (currentIndex === carouselData.length - 1) {
                routeToSignIn();
              } else {
                const nextIndex = currentIndex + 1;
                scrollToIndex(nextIndex);
              }
            }}
          >
            {t('intro.continue')}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[900],
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
