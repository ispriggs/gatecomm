// ============================================
// TAB LAYOUT
// Removes the default tab bar completely
// Our app uses its own navigation
// ============================================
import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}