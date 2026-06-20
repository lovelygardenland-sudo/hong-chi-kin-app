import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { SHOP } from '../constants';
import { theme } from '../constants/theme';

interface Props {
  message?: string;
  style?: ViewStyle;
}

export function WhatsAppQueryButton({
  message = '你好，我想查詢康姿健療程及預約',
  style,
}: Props) {
  const openWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`
    );
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={openWhatsApp}>
      <Text style={styles.text}>WhatsApp 查詢</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#25D366',
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
});
