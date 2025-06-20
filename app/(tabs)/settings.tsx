"use client"

import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert, ScrollView } from "react-native"
import { router } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { User, Bell, Video, Mic, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun } from "lucide-react-native"

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  type: "navigation" | "toggle" | "action"
  value?: boolean
  onPress: () => void
  danger?: boolean
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const { theme, isDark, toggleTheme } = useTheme()

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            router.replace("/(auth)/login")
          } catch (error) {
            Alert.alert("Error", "Failed to sign out")
          }
        },
      },
    ])
  }

  const showComingSoon = (feature: string) => {
    Alert.alert("Coming Soon", `${feature} feature will be available in a future update!`)
  }

  const settingsData: SettingItem[] = [
    {
      id: "profile",
      title: "Profile",
      subtitle: "Manage your profile information",
      icon: <User size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Profile management"),
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Call alerts and notifications",
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Notification settings"),
    },
    {
      id: "video",
      title: "Video Settings",
      subtitle: "Camera and video quality",
      icon: <Video size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Video settings"),
    },
    {
      id: "audio",
      title: "Audio Settings",
      subtitle: "Microphone and audio quality",
      icon: <Mic size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Audio settings"),
    },
    {
      id: "theme",
      title: "Dark Mode",
      subtitle: "Toggle between light and dark theme",
      icon: isDark ? (
        <Moon size={20} color={theme.colors.textSecondary} />
      ) : (
        <Sun size={20} color={theme.colors.textSecondary} />
      ),
      type: "toggle",
      value: isDark,
      onPress: toggleTheme,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Data protection and security settings",
      icon: <Shield size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Privacy settings"),
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      type: "navigation",
      onPress: () => showComingSoon("Help & Support"),
    },
    {
      id: "signout",
      title: "Sign Out",
      subtitle: "Sign out of your account",
      icon: <LogOut size={20} color={theme.colors.error} />,
      type: "action",
      onPress: handleSignOut,
      danger: true,
    },
  ]

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity key={item.id} style={styles.settingItem} onPress={item.onPress} disabled={item.type === "toggle"}>
      <View style={styles.settingIcon}>{item.icon}</View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.danger && { color: theme.colors.error }]}>{item.title}</Text>
        {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
      </View>
      <View style={styles.settingAction}>
        {item.type === "toggle" ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        ) : (
          <ChevronRight size={20} color={item.danger ? theme.colors.error : theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter-Bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    userAvatar: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    userAvatarText: {
      fontSize: 24,
      fontFamily: "Inter-Bold",
      color: theme.colors.white,
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
    },
    settingsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingSubtitle: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
    },
    settingAction: {
      marginLeft: theme.spacing.md,
    },
    version: {
      textAlign: "center",
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{getInitials(user?.displayName || user?.email || "U")}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.displayName || "User"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          {settingsData.map(renderSettingItem)}
          <Text style={styles.version}>PCMI Meet v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
