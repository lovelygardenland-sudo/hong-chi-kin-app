import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.navy },
          headerTintColor: theme.colors.white,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: theme.colors.lightPink },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ title: '會員登入', presentation: 'modal' }}
        />
        <Stack.Screen
          name="booking/confirm"
          options={{ title: '確認預約' }}
        />
        <Stack.Screen
          name="treatment/[id]"
          options={{ title: '療程詳情' }}
        />
      </Stack>
    </>
  );
}
