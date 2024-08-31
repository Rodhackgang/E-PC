import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const FadeInView = ({ children }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.fadingContainer, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const Section = ({ title, content, onPress }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const Homepage = () => {
  const navigation = useNavigation();
  
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <FadeInView>
        <Text style={styles.title}>Avantages de l'application E-PC</Text>
      </FadeInView>
      <FadeInView>
        <Section
          title="QCM des Concours Directs"
          content="Accédez à une vaste collection de sujets des concours directs pour vous préparer efficacement."
          onPress={() => navigateTo('Detailssujetdirect')}
        />
      </FadeInView>
      <FadeInView>
        <Section
          title="Corrigés des QCM Concours Directs"
          content="Consultez les corrigés détaillés pour vérifier vos réponses et améliorer vos compétences."
          onPress={() => navigateTo('Detailscorrigerdirect')}
        />
      </FadeInView>
      <FadeInView>
        <Section
          title="QCM des Concours Professionnels"
          content="Préparez-vous pour les concours professionnels avec des sujets spécifiques."
          onPress={() => navigateTo('Detailssujetprofesionel')}
        />
      </FadeInView>
      <FadeInView>
        <Section
          title="QCM en PC"
          content="Testez vos connaissances avec des QCM en PC pour évaluer votre niveau."
          onPress={() => navigateTo('DetailsListqcmpc')}
        />
      </FadeInView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#b22222',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  fadingContainer: {
    flex: 1,
  },
});

export default Homepage;
