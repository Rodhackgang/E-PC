import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Onboarding () {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    const timeout = setTimeout(() => {
        navigation.navigate('Main'); 
      }, 2000);
    return () => clearTimeout(timeout);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        E-PC
      </Animated.Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6eaf0', // Couleur de fond plus sophistiquée
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 56,
    fontWeight: '900', 
    color: '#0A84FF', // Bleu vif et moderne
    fontFamily: 'Roboto', // Police professionnelle courante
    letterSpacing: 3, // Espacement des lettres pour plus de style
    textTransform: 'uppercase', // Texte en majuscules pour plus de professionnalisme
  },
});
