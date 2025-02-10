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
import React from 'react';

type PreviousData = RouterOutputs['generation']['getAll'];

export default function WizardComponent() {
  const { t } = useTranslation();
  const { language } = useCurrentLanguage();
  const { setWizardVisible } = useAppContext();
  const hideModal = () => setWizardVisible(false);
  const router = useRouter();
  const [image, setImage] = useState<string>();
  const utils = api.useUtils();
  const { mutate, isPending } = api.generation.create.useMutation({
    onMutate: async () => {
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
      utils.generation.getAll.setData({ language }, context?.previousData);
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
    mutate({ image: imageBase64, imageType: 'image/jpeg' });
    router.push('/(auth)/(dashboard)/home');
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    await handleImagePicked(result);
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

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FORM_SHEET,
      });
      await handleImagePicked(result);
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Failed to open camera. Please try again.', [
        { text: 'OK' },
      ]);
    }
    hideModal();
  };

  return (
    <>
      <WizardButton isPending={isPending} />
      <WizardModal handleCamera={handleCamera} handleGallery={handleGallery} />
    </>
  );
}
