"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  sendPasswordResetEmail,
  updateProfile,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL2_jMfD4ImycSiZCo5FyOQFbX1IcJlsQ",
  authDomain: "rn-video-call-2f903.firebaseapp.com",
  projectId: "rn-video-call-2f903",
  storageBucket: "rn-video-call-2f903.firebasestorage.app",
  messagingSenderId: "994013507567",
  appId: "1:994013507567:web:b499c47b08d533063e101a",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOutUser = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    resetPassword,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
