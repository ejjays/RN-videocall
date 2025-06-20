"use client"

import type React from "react"
import { createContext, useContext } from "react"
// import { StreamVideoClient, type User as StreamUser } from "@stream-io/video-react-native-sdk"

interface StreamUser {
  id: string
  name: string
  image?: string
}

type StreamVideoClient = {}

interface StreamContextType {
  client: StreamVideoClient | null
  user: StreamUser | null
  connecting: boolean
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

// Your Stream API key from environment variables
const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const value = {
    client: null,
    user: null,
    connecting: false,
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
