import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api, type RouterOutputs } from '~/lib/utils/api';
import { useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../lib/contexts/AppContext';
import { useCurrentLanguage } from '~/i18n';
import { useTranslation } from 'react-i18next';
import WizardButton from './Button';
import WizardModal from './Modal';

type PreviousData = RouterOutputs['generation']['getAll'];

export default function WizardComponent() {
  const { t } = useTranslation();
  const { language } = useCurrentLanguage();
  const { setWizardVisible } = useAppContext();
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
            ...(oldQueryData?.slice(0, 2) || []),
          ] as PreviousData
      );
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (err.data?.code === 'TOO_MANY_REQUESTS') {
        Alert.alert(
          t('splits.errors.monthlyLimitReached'),
          t('splits.errors.monthlyLimitReachedExplanation')
        );
      }
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
  const [pendingAction, setPendingAction] = useState<
    'gallery' | 'camera' | null
  >(null);

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

  const handleModalDismiss = async () => {
    if (pendingAction === 'gallery') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      await handleImagePicked(result);
    } else if (pendingAction === 'camera') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
      });
      await handleImagePicked(result);
    }
    setPendingAction(null);
  };
  const handleGallery = async () => {
    if (!libraryPermissionedGranted) {
      const { granted, canAskAgain } = await requestPermissionLibrary();
      if (!granted) {
        if (!canAskAgain) {
          Alert.alert(
            t('wizard.permissions.gallery.title'),
            t('wizard.permissions.gallery.message'),
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openAppSettings },
            ]
          );
        } else {
          Alert.alert(
            t('wizard.permissions.gallery.needed'),
            t('wizard.permissions.gallery.explanation'),
            [{ text: 'OK' }]
          );
        }
        return;
      }
    }
    setPendingAction('gallery');
    hideModal();
  };
  const handleCamera = async () => {
    if (!cameraPermissionGranted) {
      const { granted, canAskAgain } = await requestCameraPermission();
      if (!granted) {
        if (!canAskAgain) {
          Alert.alert(
            t('wizard.permissions.camera.title'),
            t('wizard.permissions.camera.message'),
            [
              { text: t('buttons.cancel'), style: 'cancel' },
              { text: t('buttons.openSettings'), onPress: openAppSettings },
            ]
          );
        } else {
          Alert.alert(
            t('wizard.permissions.camera.needed'),
            t('wizard.permissions.camera.explanation'),
            [{ text: t('buttons.ok') }]
          );
        }
        return;
      }
    }
    setPendingAction('camera');
    hideModal();
  };

  return (
    <>
      <WizardButton isPending={isPending} />
      <WizardModal
        handleCamera={handleCamera}
        handleGallery={handleGallery}
        onDismiss={handleModalDismiss}
      />
    </>
  );
}
