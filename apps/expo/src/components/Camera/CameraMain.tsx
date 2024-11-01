import * as React from 'react';
import Info from './Info';
import CameraInner from './CameraInner';

export default function CameraComponent() {
  const [infoModal, setInfoModal] = React.useState<boolean>(false);
  const [, setPicture] = React.useState<string>('');
  const handleInfoOpen = () => {
    setInfoModal(true);
  };

  const handleInfoClose = () => {
    setInfoModal(false);
  };

  return (
    <>
      {infoModal ? (
        <Info handleInfoClose={handleInfoClose} />
      ) : (
        <CameraInner setPicture={setPicture} handleInfoOpen={handleInfoOpen} />
      )}
    </>
  );
}
