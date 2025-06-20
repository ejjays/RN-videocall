import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient, User as StreamUser } from '@stream-io/video-react-native-sdk';
import { useAuth } from './AuthContext';

interface StreamContextType {
  client: StreamVideoClient | null;
  user: StreamUser | null;
  connecting: boolean;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

// Demo Stream API key - replace with your actual key
const STREAM_API_KEY = 'demo-api-key';

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [user, setUser] = useState<StreamUser | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser && !client) {
      initializeStream();
    } else if (!authUser && client) {
      cleanupStream();
    }
  }, [authUser]);

  const initializeStream = async () => {
    if (!authUser) return;

    try {
      setConnecting(true);
      
      const streamUser: StreamUser = {
        id: authUser.uid,
        name: authUser.displayName || authUser.email || 'Anonymous',
        image: authUser.photoURL || undefined,
      };

      // For demo purposes, we'll use a demo token
      // In production, you should generate this token on your backend
      const token = generateDemoToken(authUser.uid);

      const streamClient = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: streamUser,
        token,
      });

      setClient(streamClient);
      setUser(streamUser);
    } catch (error) {
      console.error('Failed to initialize Stream:', error);
    } finally {
      setConnecting(false);
    }
  };

  const cleanupStream = async () => {
    if (client) {
      await client.disconnectUser();
      setClient(null);
      setUser(null);
    }
  };

  // Demo token generation - replace with your backend token generation
  const generateDemoToken = (userId: string) => {
    // This is a demo token - in production, generate this on your backend
    return 'demo-token';
  };

  const value = {
    client,
    user,
    connecting
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
}

export function useStream() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
}