import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Recharge" options={{ headerShown: false }} />
      <Stack.Screen name="Transfer" options={{ headerShown: false }} />
      <Stack.Screen name="Reports" options={{ headerShown: false }} />
      <Stack.Screen name="Users" options={{ headerShown: false }} />
      <Stack.Screen name="Statement" options={{ headerShown: false }} />
      <Stack.Screen name="PaymentReports" options={{ headerShown: false }} />
      <Stack.Screen name="Success" options={{ headerShown: false }} />
      <Stack.Screen name="Failure" options={{ headerShown: false }} />
      <Stack.Screen name="Suspense" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="Retailers" options={{ headerShown: false }} />
    </Stack>
  );
}
