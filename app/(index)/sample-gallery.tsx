
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');
const imageWidth = (width - 60) / 2;

interface SampleImage {
  id: string;
  title: string;
  imageUrl: string;
  hasMicroplastics: boolean;
  confidence: number;
  particleCount: number;
  description: string;
}

const sampleImages: SampleImage[] = [
  {
    id: '1',
    title: 'Beach Sand Sample',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    hasMicroplastics: true,
    confidence: 0.87,
    particleCount: 23,
    description: 'Sand sample from coastal area showing multiple microplastic fragments'
  },
  {
    id: '2',
    title: 'Clean Water Sample',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    hasMicroplastics: false,
    confidence: 0.94,
    particleCount: 0,
    description: 'Pure water sample with no detectable microplastic particles'
  },
  {
    id: '3',
    title: 'Soil Sample',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    hasMicroplastics: true,
    confidence: 0.76,
    particleCount: 8,
    description: 'Agricultural soil sample containing plastic debris fragments'
  },
  {
    id: '4',
    title: 'Marine Sediment',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    hasMicroplastics: true,
    confidence: 0.91,
    particleCount: 45,
    description: 'Ocean floor sediment with high concentration of microplastics'
  },
  {
    id: '5',
    title: 'Filtered Water',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
    hasMicroplastics: false,
    confidence: 0.89,
    particleCount: 0,
    description: 'Filtered tap water showing no microplastic contamination'
  },
  {
    id: '6',
    title: 'River Sediment',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    hasMicroplastics: true,
    confidence: 0.82,
    particleCount: 15,
    description: 'River bottom sample with moderate microplastic presence'
  }
];

export default function SampleGallery() {
  const [selectedSample, setSelectedSample] = useState<SampleImage | null>(null);

  const handleSamplePress = (sample: SampleImage) => {
    console.log('Selected sample:', sample.title);
    setSelectedSample(sample);
  };

  const closeSampleDetail = () => {
    setSelectedSample(null);
  };

  if (selectedSample) {
    return (
      <View style={commonStyles.wrapper}>
        <Stack.Screen
          options={{
            title: 'Sample Details',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text },
          }}
        />
        
        <ScrollView style={styles.detailContainer}>
          <Image source={{ uri: selectedSample.imageUrl }} style={styles.detailImage} />
          
          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedSample.title}</Text>
            
            <View style={[
              styles.resultCard,
              selectedSample.hasMicroplastics ? styles.positiveResult : styles.negativeResult
            ]}>
              <View style={styles.resultHeader}>
                <IconSymbol 
                  name={selectedSample.hasMicroplastics ? "exclamationmark.triangle" : "checkmark.circle"} 
                  size={28} 
                  color={selectedSample.hasMicroplastics ? "#FF6B6B" : "#4ECDC4"} 
                />
                <Text style={styles.resultTitle}>
                  {selectedSample.hasMicroplastics ? 'Microplastics Detected' : 'No Microplastics'}
                </Text>
              </View>
              
              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Confidence:</Text>
                  <Text style={styles.resultValue}>
                    {(selectedSample.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                
                {selectedSample.hasMicroplastics && (
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Particle Count:</Text>
                    <Text style={styles.resultValue}>{selectedSample.particleCount}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.resultDescription}>
                {selectedSample.description}
              </Text>
            </View>
            
            <Button onPress={closeSampleDetail} style={styles.backButton}>
              Back to Gallery
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Sample Gallery',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol name="photo" size={48} color={colors.accent} />
          <Text style={commonStyles.title}>Sample Gallery</Text>
          <Text style={commonStyles.text}>
            Explore example images and their microplastic detection results
          </Text>
        </View>
        
        <View style={styles.gallery}>
          {sampleImages.map((sample) => (
            <Pressable
              key={sample.id}
              style={styles.sampleItem}
              onPress={() => handleSamplePress(sample)}
            >
              <Image source={{ uri: sample.imageUrl }} style={styles.sampleImage} />
              <View style={styles.sampleOverlay}>
                <Text style={styles.sampleTitle}>{sample.title}</Text>
                <View style={styles.sampleStatus}>
                  <IconSymbol 
                    name={sample.hasMicroplastics ? "exclamationmark.triangle" : "checkmark.circle"} 
                    size={16} 
                    color={sample.hasMicroplastics ? "#FF6B6B" : "#4ECDC4"} 
                  />
                  <Text style={[
                    styles.statusText,
                    { color: sample.hasMicroplastics ? "#FF6B6B" : "#4ECDC4" }
                  ]}>
                    {sample.hasMicroplastics ? 'Detected' : 'Clean'}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.actionSection}>
          <Button 
            onPress={() => router.push('/microplastic-detector')}
            style={styles.analyzeButton}
          >
            Analyze Your Own Image
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  sampleItem: {
    width: imageWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
  },
  sampleImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  sampleOverlay: {
    padding: 12,
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  sampleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionSection: {
    padding: 20,
    paddingTop: 10,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
  },
  detailContainer: {
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  resultDetails: {
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
  },
});
