import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { AnimatedFAB, Card, IconButton, Modal, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../lib/contexts/AppContext';
import { useCurrentLanguageEnum } from '~/i18n';

type PreviousData = RouterOutputs['generation']['getAll'];

export default function WizardComponent() {
  const language = useCurrentLanguageEnum();
  const { wizardVisible, setWizardVisible } = useAppContext();
  const showModal = () => setWizardVisible(true);
  const hideModal = () => setWizardVisible(false);
  const router = useRouter();
  const [image, setImage] = useState<string>();
  const utils = api.useUtils();
  const [startTime, setStartTime] = useState<number>();
  const { mutate, isPending } = api.generation.create.useMutation({
    onMutate: async () => {
      setStartTime(Date.now());
      await utils.generation.getAll.cancel();
      const previousData = utils.generation.getAll.getData();
      utils.generation.getAll.setData(
        { language },
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
            ...(oldQueryData || []),
          ] as PreviousData
      );
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      const duration = startTime ? Date.now() - startTime : 0;
      console.log(`Error after ${duration}ms:`, err);
      utils.generation.getAll.setData({ language }, context?.previousData);
    },
    onSuccess: () => {
      const duration = startTime ? Date.now() - startTime : 0;
      console.log(`Success after ${duration}ms`);
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
  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    if (pickerResult.canceled) {
      return;
    }
    const originalUri = pickerResult.assets[0]?.uri;
    if (!originalUri) return;
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      originalUri,
      [{ resize: { width: 1024 } }], // Resize maintaining aspect ratio
      {
        compress: 0.3,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    setImage(manipulatedImage.uri);
    const imageBase64 = manipulatedImage.base64;

    if (!imageBase64) return;
    const sizeInBytes = (imageBase64.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    console.log(`Compressed image size: ${sizeInMB.toFixed(2)} MB`);
    mutate({ image: imageBase64, imageType: 'image/jpeg' });
    router.push('/(auth)/(dashboard)/home');
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
      quality: 1,
    });
    await handleImagePicked(result);
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
      quality: 1,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
    });
    await handleImagePicked(result);
  };
  const handleCategory = () => {
    hideModal();
    router.push({ pathname: '/(auth)/category', params: { type: 'new' } });
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
        visible={wizardVisible}
        onDismiss={hideModal}
        style={styles.modal}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.topRow}>
          <Pressable onPress={handleGallery}>
            <Card style={styles.card}>
              <IconButton
                icon={'folder-multiple-image'}
                size={36}
                style={styles.icon}
              />
              <Text variant="labelLarge" style={styles.text}>
                Gallery
              </Text>
            </Card>
          </Pressable>
          <Pressable onPress={handleCamera}>
            <Card style={styles.card}>
              <IconButton icon="camera" size={36} style={styles.icon} />
              <Text variant="labelLarge" style={styles.text}>
                Take Photo
              </Text>
            </Card>
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Pressable onPress={handleCategory}>
            <Card style={styles.card}>
              <IconButton
                icon="human-handsdown"
                size={36}
                style={styles.icon}
              />
              <Text variant="labelLarge" style={styles.text}>
                Choose Muscle
              </Text>
            </Card>
          </Pressable>
        </View>
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
    width: '100%',
    marginBottom: 140,
    padding: 20,
  },
  card: {
    width: 160,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 0,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  bottomRow: {
    alignItems: 'center',
  },
});
