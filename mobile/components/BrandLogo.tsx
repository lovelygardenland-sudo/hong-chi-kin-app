import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function BrandLogo() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require('../assets/logo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 180,
    marginBottom: 8,
  },
});
