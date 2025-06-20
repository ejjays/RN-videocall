import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, FlatList } from "react-native"
import { router } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Video, Users, Calendar, Phone } from "lucide-react-native"

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  onPress: () => void
}

interface RecentCall {
  id: string
  name: string
  time: string
  duration: string
  type: "video" | "audio"
  status: "completed" | "missed" | "ongoing"
}

export default function HomeScreen() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [recentCalls] = useState<RecentCall[]>([
    {
      id: "1",
      name: "John Doe",
      time: "2 hours ago",
      duration: "45 min",
      type: "video",
      status: "completed",
    },
    {
      id: "2",
      name: "Team Standup",
      time: "Yesterday",
      duration: "30 min",
      type: "video",
      status: "completed",
    },
    {
      id: "3",
      name: "Sarah Wilson",
      time: "2 days ago",
      duration: "12 min",
      type: "audio",
      status: "missed",
    },
  ])

  const startVideoCall = () => {
    const callId = `call-${Date.now()}`
    router.push(`/call/${callId}?type=video`)
  }

  const startAudioCall = () => {
    const callId = `call-${Date.now()}`
    router.push(`/call/${callId}?type=audio`)
  }

  const joinMeeting = () => {
    Alert.alert(
      "Join Meeting",
      "Enter meeting ID",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Join", onPress: () => startVideoCall() },
      ],
      { cancelable: true },
    )
  }

  const scheduleMeeting = () => {
    Alert.alert("Schedule Meeting", "Meeting scheduling feature coming soon!")
  }

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Start Video Call",
      subtitle: "Begin a new video call",
      icon: <Video size={24} color={theme.colors.white} />,
      color: theme.colors.primary,
      onPress: startVideoCall,
    },
    {
      id: "2",
      title: "Start Audio Call",
      subtitle: "Begin a new audio call",
      icon: <Phone size={24} color={theme.colors.white} />,
      color: theme.colors.success,
      onPress: startAudioCall,
    },
    {
      id: "3",
      title: "Join Meeting",
      subtitle: "Join with meeting ID",
      icon: <Users size={24} color={theme.colors.white} />,
      color: theme.colors.secondary,
      onPress: joinMeeting,
    },
    {
      id: "4",
      title: "Schedule Meeting",
      subtitle: "Plan a future meeting",
      icon: <Calendar size={24} color={theme.colors.white} />,
      color: theme.colors.warning,
      onPress: scheduleMeeting,
    },
  ]

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: item.color }]} onPress={item.onPress}>
      <View style={styles.quickActionIcon}>{item.icon}</View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
      <Text style={styles.quickActionSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  )

  const renderRecentCall = ({ item }: { item: RecentCall }) => (
    <TouchableOpacity style={styles.recentCallItem}>
      <View
        style={[
          styles.callIcon,
          { backgroundColor: item.type === "video" ? theme.colors.primary : theme.colors.success },
        ]}
      >
        {item.type === "video" ? (
          <Video size={20} color={theme.colors.white} />
        ) : (
          <Phone size={20} color={theme.colors.white} />
        )}
      </View>
      <View style={styles.callInfo}>
        <Text style={styles.callName}>{item.name}</Text>
        <Text style={styles.callDetails}>
          {item.time} • {item.duration}
        </Text>
      </View>
      <View
        style={[
          styles.callStatus,
          {
            backgroundColor:
              item.status === "completed"
                ? theme.colors.success
                : item.status === "missed"
                  ? theme.colors.error
                  : theme.colors.warning,
          },
        ]}
      />
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
    greeting: {
      fontSize: 24,
      fontFamily: "Inter-Bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
    },
    quickActionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    quickActionCard: {
      width: "48%",
      aspectRatio: 1,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      justifyContent: "center",
      alignItems: "center",
      ...theme.shadows.md,
    },
    quickActionIcon: {
      marginBottom: theme.spacing.sm,
    },
    quickActionTitle: {
      fontSize: 14,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.white,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    quickActionSubtitle: {
      fontSize: 12,
      fontFamily: "Inter-Regular",
      color: theme.colors.white,
      textAlign: "center",
      opacity: 0.9,
    },
    recentCallsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    recentCallItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    callIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    callInfo: {
      flex: 1,
    },
    callName: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    callDetails: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
    },
    callStatus: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.displayName || "User"}!</Text>
        <Text style={styles.subtitle}>Ready to connect?</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <View style={styles.quickActionIcon}>{action.icon}</View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentCallsContainer}>
        <Text style={styles.sectionTitle}>Recent Calls</Text>
        {recentCalls.length > 0 ? (
          <FlatList
            data={recentCalls}
            renderItem={renderRecentCall}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent calls yet. Start your first call!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
