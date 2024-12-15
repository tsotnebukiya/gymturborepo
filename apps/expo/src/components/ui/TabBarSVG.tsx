import { Path } from 'react-native-svg';
import { useWindowDimensions } from 'react-native';
import { Svg } from 'react-native-svg';
import colors from '~/lib/utils/colors';

export default function TabBarSVG() {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Svg
      style={{
        position: 'absolute',
        bottom: 0,
      }}
      width="100%"
      height={107}
      viewBox={`0 0 ${screenWidth} 107`}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M${screenWidth * 0.388} 32C${screenWidth * 0.404} 32 ${screenWidth * 0.418} 26.422 ${screenWidth * 0.425} 20.0282C${screenWidth * 0.439} 8.1592 ${screenWidth * 0.467} 0 ${screenWidth * 0.5} 0C${screenWidth * 0.533} 0 ${screenWidth * 0.561} 8.1592 ${screenWidth * 0.575} 20.0282C${screenWidth * 0.582} 26.422 ${screenWidth * 0.596} 32 ${screenWidth * 0.612} 32H${screenWidth - 2}C${screenWidth - 1.448} 32 ${screenWidth - 1} 32.4477 ${screenWidth - 1} 33V106C${screenWidth - 1} 106.552 ${screenWidth - 1.448} 107 ${screenWidth - 2} 107H2C1.44771 107 1 106.552 1 106V33C1 32.4477 1.44772 32 2 32H${screenWidth * 0.388}Z`}
        fill={colors.tabBar}
      />
    </Svg>
  );
}
