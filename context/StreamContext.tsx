import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  StreamVideoClient,
  type User as StreamUserType,
} from "@stream-io/video-react-native-sdk";
import { useAuth } from "./AuthContext";
import { Alert } from "react-native";

interface StreamContextType {
  client: StreamVideoClient | null;
  user: StreamUserType | null;
  connecting: boolean;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [streamUser, setStreamUser] = useState<StreamUserType | null>(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    if (authLoading || !firebaseUser || !STREAM_API_KEY) {
      setConnecting(false);
      return;
    }

    const token = "YOUR_DEVELOPER_TOKEN"; // 👈 PASTE THE TOKEN YOU GENERATED HERE

    if (!token) {
      Alert.alert("Stream Token Missing", "Please provide a developer token.");
      setConnecting(false);
      return;
    }

    const userToConnect: StreamUserType = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email || "User",
      image: firebaseUser.photoURL || undefined,
    };

    const videoClient = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: userToConnect,
      token: token,
    });

    setClient(videoClient);
    setStreamUser(userToConnect);
    setConnecting(false);

    return () => {
      videoClient.disconnectUser();
      setClient(null);
      setStreamUser(null);
    };
  }, [firebaseUser, authLoading]);

  const value = {
    client,
    user: streamUser,
    connecting,
  };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

export function useStream() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
}