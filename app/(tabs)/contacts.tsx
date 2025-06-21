import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, Alert } from "react-native"
import { router } from "expo-router"
import { useTheme } from "@/context/ThemeContext"
import { Search, Plus, Video, Phone, User } from "lucide-react-native"
import { useStream } from "@/context/StreamContext" // Import the useStream hook

interface Contact {
  id: string
  name: string
  email: string
  status: "online" | "offline" | "busy" | "away"
  avatar?: string
}

export default function ContactsScreen() {
  const { theme } = useTheme()
  const { client } = useStream() // Get the Stream client from the context
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "online",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "away",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "offline",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      status: "busy",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david@example.com",
      status: "online",
    },
  ])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return theme.colors.success
      case "away":
        return theme.colors.warning
      case "busy":
        return theme.colors.error
      default:
        return theme.colors.textSecondary
    }
  }

  const startVideoCall = async (contact: Contact) => {
    if (!client) {
      Alert.alert("Error", "Stream client not available. Please try again later.");
      return;
    }
    // The user ID of the person to call
    const otherUserId = contact.id;
  
    // Create a call with the other user
    const call = client.call('default', otherUserId);
  
    try {
      // This will create the call on Stream's servers and initializes the call object
      await call.getOrCreate();
      // Navigate to the call screen
      router.push(`/call/${otherUserId}?type=video&contact=${contact.id}`);
    } catch (err) {
      console.error("Failed to create video call", err);
      Alert.alert("Error", "Failed to start video call.");
    }
  };
  
  const startAudioCall = async (contact: Contact) => {
    if (!client) {
      Alert.alert("Error", "Stream client not available. Please try again later.");
      return;
    }
    const otherUserId = contact.id;

    const call = client.call('default', otherUserId);
    try {
      await call.getOrCreate({
        ringing: true,
        data: {
          custom: { call_type: 'audio' } 
        }
      });
      router.push(`/call/${otherUserId}?type=audio&contact=${contact.id}`);
    } catch (err) {
      console.error("Failed to create audio call", err);
      Alert.alert("Error", "Failed to start audio call.");
    }
  };

  const addContact = () => {
    Alert.alert("Add Contact", "Contact management feature coming soon!")
  }

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={20} color={theme.colors.textSecondary} />
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
          <Text style={[styles.contactStatus, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
          onPress={() => startAudioCall(item)}
        >
          <Phone size={16} color={theme.colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => startVideoCall(item)}
        >
          <Video size={16} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    title: {
      fontSize: 28,
      fontFamily: "Inter-Bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      height: 50,
      flex: 1,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.text,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      width: 50,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing.md,
      ...theme.shadows.md,
    },
    contactsList: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    contactInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    avatarContainer: {
      position: "relative",
      marginRight: theme.spacing.md,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    statusIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: theme.borderRadius.full,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    contactDetails: {
      flex: 1,
    },
    contactName: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    contactEmail: {
      fontSize: 14,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    contactStatus: {
      fontSize: 12,
      fontFamily: "Inter-Medium",
    },
    contactActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: "Inter-Regular",
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.searchContainer}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addContact}>
            <Plus size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contactsList}>
        {filteredContacts.length > 0 ? (
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? "No contacts found" : "No contacts yet. Add some contacts to get started!"}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
