import { Alert, Linking, StyleSheet } from 'react-native';
import { AnimatedFAB, Card, IconButton, Modal, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  showModal: () => void;
  hideModal: () => void;
  visible: boolean;
}

export default function WizardComponent({
  showModal,
  hideModal,
  visible,
}: Props) {
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [permissionLibrary, requestPermissionLibrary] =
    ImagePicker.useMediaLibraryPermissions();
  const cameraPermissionGranted = cameraPermission?.granted;
  const libraryPermissionedGranted = permissionLibrary?.granted;
  const openAppSettings = () => {
    void Linking.openSettings();
  };
  // const { mutate } = useMutation({
  //   mutationFn: uploadImage,
  //   onSuccess: () => {
  //     console.log('success');
  //   },
  //   onError: (error: any) => {
  //     console.log('Upload error:', {
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status,
  //     });
  //   },
  // });
  const handleImagePicked = (pickerResult: ImagePicker.ImagePickerResult) => {
    if (pickerResult.canceled) {
      return;
    }
    const imageType = pickerResult.assets[0]?.mimeType;
    const imageBase64 = pickerResult.assets[0]?.base64;
    const formData = new FormData();
    formData.append('image', imageBase64);
    formData.append('imageType', imageType);
    // mutate(formData);
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
  return (
    <>
      <AnimatedFAB
        variant="secondary"
        icon={'plus'}
        label={'Label'}
        extended={false}
        onPress={showModal}
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
