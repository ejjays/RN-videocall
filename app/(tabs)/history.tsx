import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Search, Video, Phone, Calendar, Clock, Users } from 'lucide-react-native';

interface CallHistoryItem {
  id: string;
  title: string;
  participants: string[];
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'audio';
  status: 'completed' | 'missed' | 'cancelled';
  isGroup: boolean;
}

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'audio' | 'missed'>('all');
  const [callHistory] = useState<CallHistoryItem[]>([
    {
      id: '1',
      title: 'John Doe',
      participants: ['John Doe'],
      date: 'Today',
      time: '2:30 PM',
      duration: '45 min',
      type: 'video',
      status: 'completed',
      isGroup: false,
    },
    {
      id: '2',
      title: 'Team Standup',
      participants: ['Sarah Wilson', 'Mike Johnson', 'Emily Davis'],
      date: 'Yesterday',
      time: '10:00 AM',
      duration: '30 min',
      type: 'video',
      status: 'completed',
      isGroup: true,
    },
    {
      id: '3',
      title: 'Sarah Wilson',
      participants: ['Sarah Wilson'],
      date: 'Yesterday',
      time: '3:15 PM',
      duration: '12 min',
      type: 'audio',
      status: 'missed',
      isGroup: false,
    },
    {
      id: '4',
      title: 'Project Review',
      participants: ['David Brown', 'Emily Davis'],
      date: '2 days ago',
      time: '1:45 PM',
      duration: '1h 15min',
      type: 'video',
      status: 'completed',
      isGroup: true,
    },
    {
      id: '5',
      title: 'Mike Johnson',
      participants: ['Mike Johnson'],
      date: '3 days ago',
      time: '4:20 PM',
      duration: '0 min',
      type: 'video',
      status: 'cancelled',
      isGroup: false,
    },
  ]);

  const filteredHistory = callHistory.filter(call => {
    const matchesSearch = call.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'missed' && call.status === 'missed') ||
      (selectedFilter !== 'missed' && call.type === selectedFilter);

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'missed': return theme.colors.error;
      case 'cancelled': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'missed': return '✗';
      case 'cancelled': return '⊘';
      default: return '•';
    }
  };

  const startNewCall = (call: CallHistoryItem) => {
    const callId = `call-${Date.now()}`;
    router.push(`/call/${callId}?type=${call.type}`);
  };

  const filters = [
    { key: 'all', label: 'All', icon: <Clock size={16} color={theme.colors.textSecondary} /> },
    { key: 'video', label: 'Video', icon: <Video size={16} color={theme.colors.textSecondary} /> },
    { key: 'audio', label: 'Audio', icon: <Phone size={16} color={theme.colors.textSecondary} /> },
    { key: 'missed', label: 'Missed', icon: <Calendar size={16} color={theme.colors.textSecondary} /> },
  ];

  const renderFilter = (filter: typeof filters[0]) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterButton,
        selectedFilter === filter.key && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter.key as any)}
    >
      {filter.icon}
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter.key && styles.filterTextActive,
        ]}
      >
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: CallHistoryItem }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => startNewCall(item)}>
      <View style={styles.historyIcon}>
        {item.isGroup ? (
          <Users size={20} color={theme.colors.textSecondary} />
        ) : item.type === 'video' ? (
          <Video size={20} color={theme.colors.textSecondary} />
        ) : (
          <Phone size={20} color={theme.colors.textSecondary} />
        )}
      </View>
      <View style={styles.historyDetails}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={[styles.statusIndicator, { color: getStatusColor(item.status) }]}>
            {getStatusIcon(item.status)}
          </Text>
        </View>
        {item.isGroup && (
          <Text style={styles.participantsList}>
            {item.participants.join(', ')}
          </Text>
        )}
        <View style={styles.historyMeta}>
          <Text style={styles.historyDate}>{item.date} • {item.time}</Text>
          <Text style={styles.historyDuration}>
            {item.status === 'cancelled' ? 'Cancelled' : item.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      height: 50,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.xs,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    filterTextActive: {
      color: theme.colors.white,
    },
    historyList: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    historyDetails: {
      flex: 1,
    },
    historyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    historyTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    statusIndicator: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
    participantsList: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    historyMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyDate: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    historyDuration: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Call History</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search call history..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        {filters.map(renderFilter)}
      </View>

      <View style={styles.historyList}>
        {filteredHistory.length > 0 ? (
          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No calls found' : 'No call history yet. Make your first call!'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}