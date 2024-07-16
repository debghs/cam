import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Canvas, Paint, Rect } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState([]);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;
  const navigation = useNavigation();

  useEffect(() => {
    const getPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    };
    getPermissions();
  }, []);

  const onFacesDetected = (faces) => {
    setFaces(faces);
  };

  const captureSelfie = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      navigation.navigate('Feed', { photo });
    }
  };

  if (!device || !hasPermission) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={cameraRef}
        frameProcessor={onFacesDetected}
        frameProcessorFps={5}
      />
      <Canvas style={StyleSheet.absoluteFill}>
        {faces.map((face, index) => (
          <Paint key={index} color="red" style="stroke" strokeWidth={2}>
            <Rect x={face.bounds.origin.x} y={face.bounds.origin.y} width={face.bounds.size.width} height={face.bounds.size.height} />
          </Paint>
        ))}
      </Canvas>
      <TouchableOpacity style={styles.captureButton} onPress={captureSelfie}>
        <Text style={styles.buttonText}>Capture Selfie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Feed')}>
        <Text style={styles.buttonText}>Feed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  captureButton: {
    position: 'absolute',
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButton: {
    position: 'absolute',
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default CameraScreen;
