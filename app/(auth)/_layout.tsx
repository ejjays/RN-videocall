"use client"

import { Stack } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { Redirect } from "expo-router"

export default function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  )
}
