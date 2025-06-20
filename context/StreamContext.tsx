"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { StreamVideoClient, type User as StreamUser } from "@stream-io/video-react-native-sdk"
import { useAuth } from "./AuthContext"

interface StreamContextType {
  client: StreamVideoClient | null
  user: StreamUser | null
  connecting: boolean
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

// Your Stream API key from environment variables
const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [user, setUser] = useState<StreamUser | null>(null)
  const [connecting, setConnecting] = useState(false)
  const { user: authUser } = useAuth()

  useEffect(() => {
    if (authUser && !client && STREAM_API_KEY) {
      initializeStream()
    } else if (!authUser && client) {
      cleanupStream()
    }
  }, [authUser])

  const initializeStream = async () => {
    if (!authUser || !STREAM_API_KEY) return

    try {
      setConnecting(true)

      const streamUser: StreamUser = {
        id: authUser.uid,
        name: authUser.displayName || authUser.email || "Anonymous",
        image: authUser.photoURL || undefined,
      }

      // Generate a user token (in production, this should be done on your backend)
      const token = generateUserToken(authUser.uid)

      const streamClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: streamUser,
        token,
      })

      setClient(streamClient)
      setUser(streamUser)
    } catch (error) {
      console.error("Failed to initialize Stream:", error)
    } finally {
      setConnecting(false)
    }
  }

  const cleanupStream = async () => {
    if (client) {
      await client.disconnectUser()
      setClient(null)
      setUser(null)
    }
  }

  // Simple token generation for development (replace with backend token generation in production)
  const generateUserToken = (userId: string) => {
    // For development, we'll use a simple approach
    // In production, generate this token on your backend using the STREAM_SECRET_KEY
    return `dev-token-${userId}`
  }

  const value = {
    client,
    user,
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
