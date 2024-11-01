import * as React from 'react';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import IconButton from '../IconButton';
import { IconButton } from 'react-native-paper';

interface MainRowActionsProps {
  handleTakePicture: () => void;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
  cameraTorch: boolean;
}
export default function MainRowActions({
  handleTakePicture,
  setCameraTorch,
  cameraTorch,
}: MainRowActionsProps) {
  return (
    <View style={styles.container}>
      <IconButton
        // icon={cameraTorch ? 'flash' : 'flash-off'}
        icon="flash"
        mode={cameraTorch ? 'contained' : 'outlined'}
        iconColor={cameraTorch ? 'black' : 'white'}
        onPress={() => setCameraTorch((prevValue) => !prevValue)}
        // iosName={
        //   cameraTorch ? 'flashlight.off.circle' : 'flashlight.slash.circle'
        // }
        // androidName={cameraTorch ? 'flash' : 'flash-off'}
      />
      <TouchableOpacity onPress={handleTakePicture}>
        <SymbolView
          name={'circle'}
          size={90}
          type="hierarchical"
          tintColor={'white'}
          animationSpec={{
            effect: {
              type: 'bounce',
            },
          }}
          fallback={
            <TouchableOpacity
              onPress={handleTakePicture}
              style={{
                width: 90,
                height: 90,
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>{'📷'}</Text>
            </TouchableOpacity>
          }
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    position: 'absolute',
    bottom: 45,
  },
});
