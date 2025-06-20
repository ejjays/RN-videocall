import type React from "react";
import { createContext, useContext } from "react";

// All of this is commented out
/*
import { StreamVideoClient, type User as StreamUserType } from "@stream-io/video-react-native-sdk";
import { useAuth } from "./AuthContext";
import { Alert } from "react-native";

interface StreamContextType {
  client: StreamVideoClient | null;
  user: StreamUserType | null;
  connecting: boolean;
}
*/

const StreamContext = createContext<any | undefined>(undefined);

// const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const value = {
    client: null,
    user: null,
    connecting: false,
  };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

export function useStream() {
  // Return a dummy context to avoid errors
  return { client: null, user: null, connecting: false };
}