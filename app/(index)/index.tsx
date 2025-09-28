
import React from "react";
import { FlatList, Pressable, StyleSheet, View, Text } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { BodyScrollView } from "@/components/BodyScrollView";
import { Stack, router } from "expo-router";
import { backgroundColors } from "@/constants/Colors";
import { IconCircle } from "@/components/IconCircle";
import { Button } from "@/components/button";
import { commonStyles, colors } from "@/styles/commonStyles";

const ICON_COLOR = "#007AFF";

const appFeatures = [
  {
    id: "microplastic-detector",
    title: "Microplastic Detector",
    description: "Analyze images for microplastic particles using AI",
    icon: "camera",
    emoji: "🔬",
    route: "/microplastic-detector"
  },
  {
    id: "sample-gallery",
    title: "Sample Gallery",
    description: "View example images and detection results",
    icon: "photo",
    emoji: "📸",
    route: "/sample-gallery"
  },
  {
    id: "detection-history",
    title: "Detection History",
    description: "Review your previous analysis results",
    icon: "clock",
    emoji: "📊",
    route: "/detection-history"
  },
  {
    id: "about",
    title: "About Microplastics",
    description: "Learn about microplastic pollution and detection",
    icon: "info.circle",
    emoji: "ℹ️",
    route: "/about"
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresList: {
    padding: 20,
  },
  featureItem: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
  quickStartSection: {
    padding: 20,
    paddingTop: 0,
  },
  quickStartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  quickStartButton: {
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
});

export default function HomeScreen() {
  const renderFeatureItem = ({ item }: { item: typeof appFeatures[0] }) => (
    <Pressable
      style={styles.featureItem}
      onPress={() => {
        console.log(`Navigating to ${item.route}`);
        router.push(item.route as any);
      }}
    >
      <IconCircle 
        emoji={item.emoji} 
        backgroundColor={colors.accent + '20'} 
        size={50}
      />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.grey} />
    </Pressable>
  );

  const renderEmptyList = () => (
    <View style={{ padding: 20 }}>
      <Text style={commonStyles.text}>Loading features...</Text>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable onPress={() => router.push("/about")}>
      <IconSymbol name="info.circle" size={24} color={colors.text} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable onPress={() => console.log("Menu pressed")}>
      <IconSymbol name="line.horizontal.3" size={24} color={colors.text} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Microplastic Detector",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
        }}
      />
      
      <BodyScrollView>
        <View style={styles.header}>
          <IconSymbol 
            name="camera" 
            size={64} 
            color={colors.accent} 
            style={styles.headerIcon}
          />
          <Text style={styles.title}>Microplastic Detector</Text>
          <Text style={styles.subtitle}>
            Advanced AI-powered detection of microplastic particles in environmental samples
          </Text>
        </View>

        <View style={styles.quickStartSection}>
          <Text style={styles.quickStartTitle}>Quick Start</Text>
          <Button 
            onPress={() => router.push("/microplastic-detector")}
            style={styles.quickStartButton}
          >
            Start Detection Analysis
          </Button>
        </View>

        <FlatList
          data={appFeatures}
          renderItem={renderFeatureItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
          style={styles.featuresList}
          scrollEnabled={false}
        />
      </BodyScrollView>
    </View>
  );
}
