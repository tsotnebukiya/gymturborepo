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
        d={`M${screenWidth * 0.387} 32C${screenWidth * 0.404} 32 ${screenWidth * 0.417} 26.422 ${screenWidth * 0.425} 20.0282C${screenWidth * 0.439} 8.15917 ${screenWidth * 0.467} 0 ${screenWidth * 0.5} 0C${screenWidth * 0.533} 0 ${screenWidth * 0.561} 8.15917 ${screenWidth * 0.575} 20.0282C${screenWidth * 0.583} 26.422 ${screenWidth * 0.596} 32 ${screenWidth * 0.613} 32H${screenWidth}C${screenWidth + 0.552} 32 ${screenWidth} 32.4477 ${screenWidth} 33V106C${screenWidth} 106.552 ${screenWidth - 0.448} 107 ${screenWidth} 107H0.999997C0.447713 107 0 106.552 0 106V33C0 32.4477 0.447715 32 1 32H${screenWidth * 0.613}Z`}
        fill={colors.tabBar}
      />
    </Svg>
  );
}
