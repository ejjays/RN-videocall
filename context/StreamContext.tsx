"use client"

import type React from "react"
import { createContext, useContext } from "react"

interface StreamContextType {
  client: null
  user: null
  connecting: boolean
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

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
