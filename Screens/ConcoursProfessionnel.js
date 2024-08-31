import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Images
const pedagogieImage = require('../assets/images/memoir.jpeg');
const qcmImage = require('../assets/images/qcm.jpeg'); // Utilise l'image correcte si nécessaire

// Composant Section
const Section = ({ title, image, onPress }) => (
  <TouchableOpacity style={styles.section} onPress={onPress}>
    <Image source={image} style={styles.sectionImage} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function ConcoursProfessionnel() {
  const navigation = useNavigation();
  const pedagie = (category) => {
    navigation.navigate('Detailssujetprofesionel',{category});
  };
  const DetailsListqcmpc = () => {
    navigation.navigate('DetailsListqcmpc');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Section Pédagogie Générale</Text>
      
      <Section
        title="Pédagogie Générale"
        image={pedagogieImage}
        onPress={pedagie}
      />
      <Text style={styles.title}>Section QCM en PC</Text>
      
      <Section
        title="QCM en PC"
        image={qcmImage}
        onPress={DetailsListqcmpc}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  sectionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
