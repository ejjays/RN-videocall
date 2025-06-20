import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { StreamVideoClient, type User as StreamUserType } from "@stream-io/video-react-native-sdk"
import { useAuth } from "./AuthContext"
import { Alert } from "react-native"

interface StreamContextType {
  client: StreamVideoClient | null
  user: StreamUserType | null
  connecting: boolean
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth()
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (!STREAM_API_KEY) {
      Alert.alert("Stream Error", "Stream API key is missing. Please check your environment variables.")
      return
    }

    if (authLoading) {
      return // Wait until Firebase auth state is resolved
    }

    if (authUser && !client) {
      setConnecting(true)
      const streamUser: StreamUserType = {
        id: authUser.uid,
        name: authUser.displayName || authUser.email || "Unknown User",
        // You can add more user data here, like an image URL
        // image: authUser.photoURL,
      }

      // Initialize the Stream client
      const newClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: streamUser,
      })

      // Normally, you would fetch a token from your backend here
      // For simplicity in this example, we'll use a development token
      // WARNING: Do not use this in production.
      newClient
        .connectUser(streamUser, newClient.devToken(streamUser.id))
        .then(() => {
          setClient(newClient)
          setConnecting(false)
        })
        .catch((err) => {
          console.error("Stream connection error:", err)
          Alert.alert("Stream Error", "Could not connect to Stream services.")
          setConnecting(false)
        })
    } else if (!authUser && client) {
      // Disconnect the user when they log out
      client.disconnectUser()
      setClient(null)
    }

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser()
      }
    }
  }, [authUser, authLoading, client])

  const value = {
    client,
    user: client?.user || null,
    connecting,
  }

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
}

export function useStream() {
  const context = useContext(StreamContext)
  if (context === undefined) {
    throw new Error("useStream must be used within a StreamProvider")
  }
  return context
}