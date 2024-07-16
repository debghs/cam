import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FeedScreen = ({ route }) => {
  const { photo } = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.path }} style={styles.image} />
      <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '80%',
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

export default FeedScreen;
