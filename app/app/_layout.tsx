import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* These correspond to your file names */}
      <Stack.Screen name="index" /> 
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="chatbot" />
      <Stack.Screen name="transfer" />
      <Stack.Screen name="airtime" />
      <Stack.Screen name="electricity" />
      <Stack.Screen name="transaction" />
      <Stack.Screen name="transactions" />
    </Stack>
  );
}