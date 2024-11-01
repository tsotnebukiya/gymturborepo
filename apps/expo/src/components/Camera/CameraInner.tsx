import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { CameraView } from 'expo-camera';
import MainRowActions from './MainRowsActions';
import { useRouter } from 'expo-router';
import TopActions from './TopActions';

interface Props {
  setPicture: React.Dispatch<React.SetStateAction<string>>;
  handleInfoOpen: () => void;
}

export default function CameraInner({ handleInfoOpen }: Props) {
  const router = useRouter();
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  // const { mutate } = useMutation({
  //   mutationFn: uploadImage,
  //   onSuccess: () => {
  //     console.log('success');
  //   },
  //   onError: () => {
  //     console.log('error');
  //   },
  // });
  async function handleTakePicture() {
    // const response = await cameraRef.current?.takePictureAsync({});
    // if (response) {
    //   setPicture(response.uri);
    //   mutate(response.uri);
    // }
  }
  const handleBack = () => {
    router.back();
  };

  return (
    <CameraView
      ref={cameraRef}
      style={{ flex: 1 }}
      facing={'back'}
      mode={'picture'}
      enableTorch={cameraTorch}
      flash={'auto'}
    >
      <TopActions handleBack={handleBack} handleInfo={handleInfoOpen} />
      <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
        <View style={{ flex: 1, padding: 6 }}>
          <MainRowActions
            handleTakePicture={handleTakePicture}
            cameraTorch={cameraTorch}
            setCameraTorch={setCameraTorch}
          />
        </View>
      </SafeAreaView>
    </CameraView>
  );
}
