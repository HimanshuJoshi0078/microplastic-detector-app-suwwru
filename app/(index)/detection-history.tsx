
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  hasMicroplastics: boolean;
  confidence: number;
  particleCount: number;
  imageName: string;
}

export default function DetectionHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Load mock history data
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        date: '2024-01-15',
        time: '14:30',
        hasMicroplastics: true,
        confidence: 0.87,
        particleCount: 23,
        imageName: 'beach_sample_001.jpg'
      },
      {
        id: '2',
        date: '2024-01-14',
        time: '09:15',
        hasMicroplastics: false,
        confidence: 0.94,
        particleCount: 0,
        imageName: 'water_sample_002.jpg'
      },
      {
        id: '3',
        date: '2024-01-13',
        time: '16:45',
        hasMicroplastics: true,
        confidence: 0.76,
        particleCount: 8,
        imageName: 'soil_sample_003.jpg'
      },
      {
        id: '4',
        date: '2024-01-12',
        time: '11:20',
        hasMicroplastics: true,
        confidence: 0.91,
        particleCount: 45,
        imageName: 'sediment_sample_004.jpg'
      },
      {
        id: '5',
        date: '2024-01-11',
        time: '13:10',
        hasMicroplastics: false,
        confidence: 0.89,
        particleCount: 0,
        imageName: 'filtered_water_005.jpg'
      }
    ];
    
    setHistory(mockHistory);
    console.log('Loaded detection history:', mockHistory.length, 'items');
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all detection history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            console.log('Detection history cleared');
          }
        }
      ]
    );
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this detection result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(prev => prev.filter(item => item.id !== id));
            console.log('Deleted history item:', id);
          }
        }
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Pressable
      style={styles.historyItem}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        <View style={styles.itemStatus}>
          <IconSymbol 
            name={item.hasMicroplastics ? "exclamationmark.triangle" : "checkmark.circle"} 
            size={20} 
            color={item.hasMicroplastics ? "#FF6B6B" : "#4ECDC4"} 
          />
        </View>
      </View>
      
      <Text style={styles.itemFileName}>{item.imageName}</Text>
      
      <View style={styles.itemResults}>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Status:</Text>
          <Text style={[
            styles.resultValue,
            { color: item.hasMicroplastics ? "#FF6B6B" : "#4ECDC4" }
          ]}>
            {item.hasMicroplastics ? 'Detected' : 'Clean'}
          </Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Confidence:</Text>
          <Text style={styles.resultValue}>
            {(item.confidence * 100).toFixed(1)}%
          </Text>
        </View>
        
        {item.hasMicroplastics && (
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Particles:</Text>
            <Text style={styles.resultValue}>{item.particleCount}</Text>
          </View>
        )}
      </View>
      
      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <IconSymbol name="trash" size={16} color="#FF6B6B" />
      </Pressable>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="clock" size={64} color={colors.grey} />
      <Text style={styles.emptyTitle}>No Detection History</Text>
      <Text style={styles.emptyText}>
        Your analysis results will appear here after you start detecting microplastics
      </Text>
      <Button 
        onPress={() => console.log('Navigate to detector')}
        style={styles.startButton}
      >
        Start First Analysis
      </Button>
    </View>
  );

  const getStatistics = () => {
    const total = history.length;
    const detected = history.filter(item => item.hasMicroplastics).length;
    const clean = total - detected;
    const avgConfidence = total > 0 
      ? history.reduce((sum, item) => sum + item.confidence, 0) / total 
      : 0;
    
    return { total, detected, clean, avgConfidence };
  };

  const stats = getStatistics();

  if (selectedItem) {
    return (
      <View style={commonStyles.wrapper}>
        <Stack.Screen
          options={{
            title: 'Detection Details',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text },
          }}
        />
        
        <View style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Detection Result</Text>
            <Text style={styles.detailSubtitle}>
              {formatDate(selectedItem.date)} at {selectedItem.time}
            </Text>
          </View>
          
          <View style={[
            styles.detailCard,
            selectedItem.hasMicroplastics ? styles.positiveResult : styles.negativeResult
          ]}>
            <View style={styles.resultHeader}>
              <IconSymbol 
                name={selectedItem.hasMicroplastics ? "exclamationmark.triangle" : "checkmark.circle"} 
                size={32} 
                color={selectedItem.hasMicroplastics ? "#FF6B6B" : "#4ECDC4"} 
              />
              <Text style={styles.resultTitle}>
                {selectedItem.hasMicroplastics ? 'Microplastics Detected' : 'No Microplastics'}
              </Text>
            </View>
            
            <View style={styles.detailResults}>
              <View style={styles.detailResultRow}>
                <Text style={styles.detailResultLabel}>File Name:</Text>
                <Text style={styles.detailResultValue}>{selectedItem.imageName}</Text>
              </View>
              
              <View style={styles.detailResultRow}>
                <Text style={styles.detailResultLabel}>Confidence:</Text>
                <Text style={styles.detailResultValue}>
                  {(selectedItem.confidence * 100).toFixed(1)}%
                </Text>
              </View>
              
              {selectedItem.hasMicroplastics && (
                <View style={styles.detailResultRow}>
                  <Text style={styles.detailResultLabel}>Particle Count:</Text>
                  <Text style={styles.detailResultValue}>{selectedItem.particleCount}</Text>
                </View>
              )}
            </View>
          </View>
          
          <Button 
            onPress={() => setSelectedItem(null)}
            style={styles.backButton}
          >
            Back to History
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Detection History',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      {history.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FF6B6B' }]}>{stats.detected}</Text>
              <Text style={styles.statLabel}>Detected</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4ECDC4' }]}>{stats.clean}</Text>
              <Text style={styles.statLabel}>Clean</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats.avgConfidence * 100).toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Avg Confidence</Text>
            </View>
          </View>
        </View>
      )}
      
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {history.length > 0 && (
        <View style={styles.actionContainer}>
          <Button 
            onPress={clearHistory}
            variant="secondary"
            style={styles.clearButton}
          >
            Clear All History
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  statsContainer: {
    backgroundColor: colors.backgroundAlt,
    margin: 20,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    position: 'relative',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemTime: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 2,
  },
  itemStatus: {
    marginLeft: 12,
  },
  itemFileName: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  itemResults: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: colors.grey,
    marginRight: 6,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  clearButton: {
    backgroundColor: '#2D1B1B',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 16,
    color: colors.grey,
  },
  detailCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
  },
  positiveResult: {
    backgroundColor: '#2D1B1B',
    borderColor: '#FF6B6B',
  },
  negativeResult: {
    backgroundColor: '#1B2D2A',
    borderColor: '#4ECDC4',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  detailResults: {
    gap: 12,
  },
  detailResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailResultLabel: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '500',
  },
  detailResultValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
  },
});
