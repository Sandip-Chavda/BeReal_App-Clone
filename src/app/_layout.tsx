import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)");
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
