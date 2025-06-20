import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useTheme } from "@/context/ThemeContext"
import { useStream } from "@/context/StreamContext"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  MessageSquare,
  Monitor,
  Camera,
  VolumeX,
  Volume2,
} from "lucide-react-native"

const { width, height } = Dimensions.get("window")

export default function CallScreen() {
  const { callId, type, contact } = useLocalSearchParams()
  const { theme } = useTheme()
  const { client, user } = useStream()

  const [isVideoEnabled, setIsVideoEnabled] = useState(type === "video")
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    // Start the call
    setIsCallActive(true)

    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Auto-hide controls after 5 seconds
    const controlsTimer = setTimeout(() => {
      setShowControls(false)
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(controlsTimer)
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (Platform.OS !== "web") {
      // Implement actual video toggle with Stream SDK
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (Platform.OS !== "web") {
      // Implement actual audio toggle with Stream SDK
    }
  }

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled)
    if (Platform.OS !== "web") {
      // Implement actual speaker toggle
    }
  }

  const switchCamera = () => {
    if (Platform.OS !== "web") {
      // Implement camera switch with Stream SDK
    }
  }

  const endCall = () => {
    Alert.alert("End Call", "Are you sure you want to end this call?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Call",
        style: "destructive",
        onPress: () => {
          setIsCallActive(false)
          router.back()
        },
      },
    ])
  }

  const openSettings = () => {
    Alert.alert("Settings", "Call settings feature coming soon!")
  }

  const openChat = () => {
    Alert.alert("Chat", "In-call chat feature coming soon!")
  }

  const shareScreen = () => {
    Alert.alert("Screen Share", "Screen sharing feature coming soon!")
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black,
    },
    videoContainer: {
      flex: 1,
      position: "relative",
    },
    localVideo: {
      position: "absolute",
      top: 60,
      right: 20,
      width: 120,
      height: 160,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      zIndex: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    remoteVideo: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      fontSize: 48,
      fontFamily: "Inter-Bold",
      color: theme.colors.white,
    },
    callInfo: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: 60,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 5,
    },
    callStatus: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Inter-Medium",
      color: theme.colors.white,
      marginBottom: theme.spacing.xs,
    },
    callDuration: {
      textAlign: "center",
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.white,
      opacity: 0.8,
    },
    participantName: {
      textAlign: "center",
      fontSize: 24,
      fontFamily: "Inter-Bold",
      color: theme.colors.white,
      marginBottom: theme.spacing.sm,
    },
    controlsContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      paddingBottom: 50,
    },
    controlsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    controlButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    controlButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    controlButtonDisabled: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    endCallButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.error,
    },
    secondaryControlsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.spacing.lg,
    },
    secondaryControlButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    hiddenControls: {
      opacity: 0,
    },
    videoPlaceholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    videoDisabledIcon: {
      marginBottom: theme.spacing.md,
    },
    videoDisabledText: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.white,
      opacity: 0.7,
    },
  })

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity style={styles.videoContainer} onPress={toggleControls} activeOpacity={1}>
        {/* Remote Video / Participant View */}
        <View style={styles.remoteVideo}>
          {isVideoEnabled ? (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.participantName}>{contact ? `Contact ${contact}` : "Participant"}</Text>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
            </View>
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.participantName}>{contact ? `Contact ${contact}` : "Participant"}</Text>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.videoDisabledIcon}>
                <VideoOff size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.videoDisabledText}>Camera is off</Text>
            </View>
          )}
        </View>

        {/* Local Video Preview */}
        {isVideoEnabled && (
          <View style={styles.localVideo}>
            <Text style={{ color: theme.colors.white, fontSize: 12 }}>You</Text>
          </View>
        )}

        {/* Call Info */}
        <View style={styles.callInfo}>
          <Text style={styles.callStatus}>{isCallActive ? "Connected" : "Connecting..."}</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>

        {/* Controls */}
        <View style={[styles.controlsContainer, !showControls && styles.hiddenControls]}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
              onPress={toggleAudio}
            >
              {isAudioEnabled ? (
                <Mic size={24} color={theme.colors.white} />
              ) : (
                <MicOff size={24} color={theme.colors.white} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
              <PhoneOff size={24} color={theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
              onPress={toggleVideo}
            >
              {isVideoEnabled ? (
                <Video size={24} color={theme.colors.white} />
              ) : (
                <VideoOff size={24} color={theme.colors.white} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryControlsRow}>
            <TouchableOpacity
              style={[styles.secondaryControlButton, isSpeakerEnabled && styles.controlButtonActive]}
              onPress={toggleSpeaker}
            >
              {isSpeakerEnabled ? (
                <Volume2 size={20} color={theme.colors.white} />
              ) : (
                <VolumeX size={20} color={theme.colors.white} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControlButton} onPress={switchCamera}>
              <Camera size={20} color={theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControlButton} onPress={shareScreen}>
              <Monitor size={20} color={theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControlButton} onPress={openChat}>
              <MessageSquare size={20} color={theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryControlButton} onPress={openSettings}>
              <Settings size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
