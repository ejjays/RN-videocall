"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { Link, router } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Mail, ArrowLeft } from "lucide-react-native"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { resetPassword, error } = useAuth()
  const { theme } = useTheme()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      setEmailSent(true)
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    title: {
      fontSize: 32,
      fontFamily: "Inter-Bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xxl,
    },
    inputContainer: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 14,
      fontFamily: "Inter-Medium",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      height: 50,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.text,
    },
    resetButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    resetButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    resetButtonText: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.white,
    },
    successContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    successTitle: {
      fontSize: 24,
      fontFamily: "Inter-Bold",
      color: theme.colors.success,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    successText: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing.xl,
    },
    loginText: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
    },
    loginLink: {
      fontSize: 14,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.primary,
      marginLeft: theme.spacing.xs,
    },
    errorText: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.error,
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
  })

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!emailSent ? (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Mail size={20} color={theme.colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.resetButton, loading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>{loading ? "Sending..." : "Send Reset Link"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}. Check your inbox and follow the instructions to reset your
              password.
            </Text>
          </View>
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember your password?</Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.loginLink}>Sign In</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
