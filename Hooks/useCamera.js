import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";

const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.takePictureAsync(options);
      setPhotoUri(data.uri);
    }
  };

  return { hasPermission, cameraRef, photoUri, takePhoto, setPhotoUri };
};

export default useCamera;
