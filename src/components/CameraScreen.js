import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Canvas, Paint, Rect } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState([]);
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  //console.log("Available Devices:", devices); // Log the available devices
  const device = devices.front;
  const navigation = useNavigation();

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      if (cameraPermission === 'authorized' && microphonePermission === 'authorized') {
        setHasPermission(true);
      } else {
        Alert.alert('Permissions not granted');
      }
    };

    const requestAndroidPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setHasPermission(true);
        } else {
          Alert.alert('Permissions not granted');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    } else {
      getPermissions();
    }
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

  if (!device || !hasPermission) {
    console.log("No device or permissions not granted"); // Debugging info
    return <View style={styles.container}><Text style={{ color: 'white' }}>Initializing Camera...</Text></View>;
  }

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
