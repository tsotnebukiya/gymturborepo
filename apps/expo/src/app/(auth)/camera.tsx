import CameraComponent from '~/components/Camera/CameraMain';
import { StatusBar } from 'expo-status-bar';

export default function Camera() {
  return (
    <>
      <StatusBar style="light" />
      <CameraComponent />
    </>
  );
}
