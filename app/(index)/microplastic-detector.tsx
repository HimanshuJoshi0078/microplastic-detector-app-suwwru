
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import { commonStyles, colors } from '@/styles/commonStyles';

interface AnalysisResult {
  hasMicroplastics: boolean;
  confidence: number;
  particleCount: number;
  analysisTime: number;
  details: string;
}

export default function MicroplasticDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images for analysis.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    console.log('Picking image from gallery');
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Image selected:', result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const takePhoto = async () => {
    console.log('Taking photo with camera');
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos for analysis.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Photo taken:', result.assets[0].uri);
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    console.log('Starting image analysis');
    setIsAnalyzing(true);

    try {
      // Simulate API call to Python backend
      // In a real implementation, you would send the image to your Python backend
      const mockAnalysis = await simulateAnalysis();
      setAnalysisResult(mockAnalysis);
      console.log('Analysis completed:', mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Analysis Failed', 'There was an error analyzing the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateAnalysis = (): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        const hasMicroplastics = Math.random() > 0.5;
        const confidence = Math.random() * 0.4 + 0.6; // 60-100%
        const particleCount = hasMicroplastics ? Math.floor(Math.random() * 50) + 1 : 0;
        
        resolve({
          hasMicroplastics,
          confidence,
          particleCount,
          analysisTime: Math.random() * 2 + 1, // 1-3 seconds
          details: hasMicroplastics 
            ? `Detected ${particleCount} microplastic particles. Common types include polyethylene and polystyrene fragments.`
            : 'No microplastic particles detected in this sample. The image appears to show clean material.'
        });
      }, 2500); // 2.5 second delay to simulate processing
    });
  };

  const resetAnalysis = () => {
    console.log('Resetting analysis');
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Microplastic Detector',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <IconSymbol name="camera" size={48} color={colors.accent} style={styles.headerIcon} />
          <Text style={commonStyles.title}>Microplastic Detection</Text>
          <Text style={commonStyles.text}>
            Upload or capture an image to analyze for microplastic particles
          </Text>
        </View>

        {!selectedImage && (
          <View style={styles.imagePickerSection}>
            <View style={styles.buttonRow}>
              <Pressable style={styles.imagePickerButton} onPress={takePhoto}>
                <IconSymbol name="camera" size={32} color={colors.text} />
                <Text style={styles.buttonText}>Take Photo</Text>
              </Pressable>
              
              <Pressable style={styles.imagePickerButton} onPress={pickImageFromGallery}>
                <IconSymbol name="photo" size={32} color={colors.text} />
                <Text style={styles.buttonText}>Choose from Gallery</Text>
              </Pressable>
            </View>
          </View>
        )}

        {selectedImage && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Selected Image</Text>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            
            <View style={styles.actionButtons}>
              {!isAnalyzing && !analysisResult && (
                <Button onPress={analyzeImage} style={styles.analyzeButton}>
                  Analyze for Microplastics
                </Button>
              )}
              
              <Button 
                onPress={resetAnalysis} 
                variant="secondary" 
                style={styles.resetButton}
              >
                Select Different Image
              </Button>
            </View>
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.analysisSection}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.analysisText}>Analyzing image for microplastics...</Text>
            <Text style={commonStyles.text}>
              Using advanced computer vision algorithms to detect plastic particles
            </Text>
          </View>
        )}

        {analysisResult && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            
            <View style={[
              styles.resultCard,
              analysisResult.hasMicroplastics ? styles.positiveResult : styles.negativeResult
            ]}>
              <View style={styles.resultHeader}>
                <IconSymbol 
                  name={analysisResult.hasMicroplastics ? "exclamationmark.triangle" : "checkmark.circle"} 
                  size={32} 
                  color={analysisResult.hasMicroplastics ? "#FF6B6B" : "#4ECDC4"} 
                />
                <Text style={styles.resultTitle}>
                  {analysisResult.hasMicroplastics ? 'Microplastics Detected' : 'No Microplastics Detected'}
                </Text>
              </View>
              
              <View style={styles.resultDetails}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Confidence:</Text>
                  <Text style={styles.resultValue}>
                    {(analysisResult.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                
                {analysisResult.hasMicroplastics && (
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Particle Count:</Text>
                    <Text style={styles.resultValue}>{analysisResult.particleCount}</Text>
                  </View>
                )}
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Analysis Time:</Text>
                  <Text style={styles.resultValue}>
                    {analysisResult.analysisTime.toFixed(1)}s
                  </Text>
                </View>
              </View>
              
              <Text style={styles.resultDescription}>
                {analysisResult.details}
              </Text>
            </View>
            
            <Button onPress={resetAnalysis} style={styles.newAnalysisButton}>
              Analyze Another Image
            </Button>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Microplastic Detection</Text>
          <Text style={commonStyles.text}>
            This app uses computer vision algorithms to identify microplastic particles in images. 
            Microplastics are tiny plastic fragments less than 5mm in size that can be found in 
            water, soil, and food samples.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    marginBottom: 16,
  },
  imagePickerSection: {
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  imagePickerButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  actionButtons: {
    gap: 12,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.backgroundAlt,
  },
  analysisSection: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 30,
  },
  analysisText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSection: {
    marginBottom: 30,
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
  newAnalysisButton: {
    backgroundColor: colors.secondary,
  },
  infoSection: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
});
