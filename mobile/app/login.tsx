import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SHOP } from '../constants';
import { theme } from '../constants/theme';
import { Button } from '../components/Button';
import { login } from '../services/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedPhone = phone.replace(/\s/g, '');
    if (trimmedPhone.length < 8) {
      Alert.alert('請輸入有效手機號碼');
      return;
    }
    setLoading(true);
    try {
      await login(trimmedPhone, name.trim() || '會員');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>{SHOP.name}</Text>
        <Text style={styles.sub}>會員登入</Text>
      </View>

      <Text style={styles.label}>手機號碼</Text>
      <TextInput
        style={styles.input}
        placeholder="例如：9123 4567"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={11}
      />

      <Text style={styles.label}>姓名（選填）</Text>
      <TextInput
        style={styles.input}
        placeholder="你的姓名"
        value={name}
        onChangeText={setName}
      />

      <Button
        title="登入"
        onPress={handleLogin}
        loading={loading}
        variant="pink"
        style={styles.btn}
      />

      <Text style={styles.hint}>
        示範模式：輸入手機號碼即可登入。{'\n'}
        正式版將使用 SMS 驗證碼登入。
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.lightPink,
  },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  logo: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.navy,
  },
  sub: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    marginTop: 4,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.navy,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  btn: { marginTop: theme.spacing.sm },
  hint: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
});
