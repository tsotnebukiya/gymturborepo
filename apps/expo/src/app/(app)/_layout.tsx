import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="/home" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
