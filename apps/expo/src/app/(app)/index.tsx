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
import Gradient from '~/components/ui/Gradient';
import TopBar from '~/components/shared/TopBar';

export interface CarouselData {
  id: number;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

export default function IntroScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
      <TopBar languageButton={true} />
      <View style={styles.imageContainer}>
        <Image
          source={carouselData[currentIndex]?.image}
          resizeMode="contain"
          style={
            {
              // flex: 1,
              // width: '100%',
              // height: '100%',
              // backgroundColor: 'red',
            }
          }
        />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Gradient />
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
          <Button type="secondary" onPress={routeToSignIn} flex={true}>
            {t('intro.skip')}
          </Button>
          <Button
            flex={true}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
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
