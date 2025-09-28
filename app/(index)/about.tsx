
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { commonStyles, colors } from '@/styles/commonStyles';

export default function About() {
  const openExternalLink = (url: string) => {
    console.log('Opening external link:', url);
    Linking.openURL(url);
  };

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'About Microplastics',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <IconSymbol name="info.circle" size={48} color={colors.accent} />
          <Text style={commonStyles.title}>About Microplastics</Text>
          <Text style={commonStyles.text}>
            Understanding microplastic pollution and detection technology
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are Microplastics?</Text>
          <Text style={styles.bodyText}>
            Microplastics are tiny plastic particles smaller than 5 millimeters in diameter. 
            They come from the breakdown of larger plastic items, synthetic textiles, 
            tire wear, and industrial processes. These particles are now found everywhere 
            in our environment - from the deepest ocean trenches to the highest mountains.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <Text style={styles.bodyText}>
            Microplastics pose significant threats to marine life and ecosystems. 
            They can be ingested by organisms at all levels of the food chain, 
            potentially causing physical harm and introducing toxic chemicals. 
            The long-term effects on human health are still being studied.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Technology</Text>
          <Text style={styles.bodyText}>
            This app uses advanced computer vision and machine learning algorithms 
            to identify microplastic particles in images. The AI model has been 
            trained on thousands of samples to recognize various types of plastic 
            particles based on their shape, color, and texture characteristics.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Capture or upload an image of your sample
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                AI algorithms analyze the image for plastic particles
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                Results show detection confidence and particle count
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accuracy & Limitations</Text>
          <Text style={styles.bodyText}>
            While our AI model achieves high accuracy in controlled conditions, 
            results may vary based on image quality, lighting, and sample preparation. 
            For scientific research or regulatory purposes, laboratory analysis 
            is still recommended for definitive results.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taking Action</Text>
          <Text style={styles.bodyText}>
            You can help reduce microplastic pollution by:
          </Text>
          <View style={styles.actionList}>
            <Text style={styles.actionItem}>• Reducing single-use plastic consumption</Text>
            <Text style={styles.actionItem}>• Choosing natural fiber clothing</Text>
            <Text style={styles.actionItem}>• Properly disposing of plastic waste</Text>
            <Text style={styles.actionItem}>• Supporting plastic-free alternatives</Text>
            <Text style={styles.actionItem}>• Participating in cleanup efforts</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            onPress={() => router.push('/microplastic-detector')}
            style={styles.primaryButton}
          >
            Start Detection
          </Button>
          
          <Button 
            onPress={() => router.push('/sample-gallery')}
            variant="secondary"
            style={styles.secondaryButton}
          >
            View Sample Gallery
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This app is designed for educational and awareness purposes. 
            For scientific research, please consult with environmental laboratories.
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'left',
  },
  stepsList: {
    marginTop: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionList: {
    marginTop: 12,
  },
  actionItem: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 4,
  },
  actionButtons: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundAlt,
  },
  footer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
