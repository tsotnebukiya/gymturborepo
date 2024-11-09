import { Alert, Linking, StyleSheet } from 'react-native';
import { AnimatedFAB, Card, IconButton, Modal, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { api, type RouterOutputs } from '~/utils/api';
import { useState } from 'react';

interface Props {
  showModal: () => void;
  hideModal: () => void;
  visible: boolean;
}

type PreviousData = RouterOutputs['generation']['getAll'];

export default function WizardComponent({
  showModal,
  hideModal,
  visible,
}: Props) {
  const [image, setImage] = useState<string>();
  const utils = api.useUtils();
  const { mutate, isPending } = api.generation.create.useMutation({
    onMutate: async () => {
      await utils.generation.getAll.cancel();
      const previousData = utils.generation.getAll.getData();
      utils.generation.getAll.setData(
        undefined,
        (oldQueryData: PreviousData | undefined) =>
          [
            {
              createdAt: new Date(),
              description: null,
              id: 'placeholder',
              image,
              name: 'Pending?',
              status: 'PENDING',
            },
            ...(oldQueryData ?? []),
          ] as PreviousData
      );
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      utils.generation.getAll.setData(undefined, context?.previousData);
    },
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      void utils.generation.getAll.invalidate();
    },
  });
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [permissionLibrary, requestPermissionLibrary] =
    ImagePicker.useMediaLibraryPermissions();
  const cameraPermissionGranted = cameraPermission?.granted;
  const libraryPermissionedGranted = permissionLibrary?.granted;
  const openAppSettings = () => {
    void Linking.openSettings();
  };
  const handleImagePicked = (pickerResult: ImagePicker.ImagePickerResult) => {
    if (pickerResult.canceled) {
      return;
    }
    setImage(pickerResult.assets[0]?.uri);
    const imageType = pickerResult.assets[0]?.mimeType;
    const imageBase64 = pickerResult.assets[0]?.base64;
    if (!imageBase64 || !imageType) return;
    mutate({ image: imageBase64, imageType });
  };
  const handleGallery = async () => {
    if (!libraryPermissionedGranted) {
      const { granted, canAskAgain } = await requestPermissionLibrary();
      if (!granted) {
        if (!canAskAgain) {
          Alert.alert(
            'Gallery Permission Required',
            'Please enable gallery access in your device settings to use this feature.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings },
            ]
          );
        } else {
          Alert.alert(
            'Gallery Permission Needed',
            'We need gallery access to select photos. Please grant permission when prompted.',
            [{ text: 'OK' }]
          );
        }
        return;
      }
    }
    hideModal();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    handleImagePicked(result);
  };
  const handleCamera = async () => {
    if (!cameraPermissionGranted) {
      const { granted, canAskAgain } = await requestCameraPermission();
      if (!granted) {
        if (!canAskAgain) {
          Alert.alert(
            'Camera Permission Required',
            'Please enable camera access in your device settings to use this feature.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings },
            ]
          );
        } else {
          Alert.alert(
            'Camera Permission Needed',
            'We need camera access to take photos. Please grant permission when prompted.',
            [{ text: 'OK' }]
          );
        }
        return;
      }
    }
    hideModal();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      cameraType: ImagePicker.CameraType.back,
      base64: true,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
    });
    handleImagePicked(result);
  };
  const handleFAB = () => {
    if (isPending) {
      Alert.alert(
        'Generation in Progress',
        'Please wait for the current generation to complete.',
        [{ text: 'OK' }]
      );
      return;
    }
    showModal();
  };
  return (
    <>
      <AnimatedFAB
        variant="secondary"
        icon={'plus'}
        label={'Label'}
        extended={false}
        onPress={handleFAB}
        visible={true}
        animateFrom={'right'}
        iconMode={'dynamic'}
        style={styles.fabStyle}
      />
      <Modal
        visible={visible}
        onDismiss={hideModal}
        style={styles.modal}
        contentContainerStyle={styles.modalContainer}
      >
        <Card onPress={handleGallery} style={styles.card}>
          <IconButton icon="folder-multiple-image" size={36} />
          <Text variant="labelLarge" style={styles.text}>
            Gallery
          </Text>
        </Card>
        <Card style={styles.card} onPress={handleCamera}>
          <IconButton icon="camera" size={36} />

          <Text variant="labelLarge" style={styles.text}>
            Take Photo
          </Text>
        </Card>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    bottom: 100,
    right: 16,
  },
  modal: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 20,
    marginBottom: 140,
  },
  card: {
    width: 130,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
