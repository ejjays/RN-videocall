import { useLocalSearchParams } from "expo-router";
import {
  CallContent,
  StreamCall,
  StreamVideo,
} from "@stream-io/video-react-native-sdk";
import { useStream } from "@/context/StreamContext";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function CallScreen() {
  const { callId } = useLocalSearchParams();
  const { client, connecting: isStreamConnecting } = useStream();
  const { theme } = useTheme();

  // The call object from Stream, will be null until we can create it
  const [call, setCall] = useState(null);

  // Convert callId to string if it's an array
  const callIdString = Array.isArray(callId) ? callId[0] : callId;

  useEffect(() => {
    if (!client || !callIdString) {
      return;
    }

    // Create a new call object
    const newCall = client.call("default", callIdString);

    // Try to get or create the call on the server
    const joinCall = async () => {
      try {
        await newCall.getOrCreate();
        setCall(newCall);
      } catch (error) {
        console.error("Error joining or creating call:", error);
      }
    };

    joinCall();
  }, [client, callIdString]);

  // Show a loading state while Stream is connecting or the call object is being created
  if (isStreamConnecting || !client || !call) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{ color: theme.colors.text, fontFamily: 'Inter-Medium', fontSize: 18 }}>
          Connecting to call...
        </Text>
      </View>
    );
  }

  // Once the client and call are ready, render the call UI
  return (
    <View style={styles.container}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CallContent />
        </StreamCall>
      </StreamVideo>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});
