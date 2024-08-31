import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Detailscorrigerdirect = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Charge les questions en fonction de la catégorie
    if (category && category.questions) {
      const loadedQuestions = category.questions.map(q => ({
        question: q.text,
        options: q.options
      }));
      setQuestions(loadedQuestions);
    }
  }, [category]);

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionContainer} key={index}>
      <Text style={styles.questionText}>{`${index + 1}. ${item.question}`}</Text>
      {item.options.map((option, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.optionButton,
            option.isCorrect ? styles.correctOptionButton : null // Applique un style différent si l'option est correcte
          ]}
        >
          <Text
            style={[
              styles.optionText,
              option.isCorrect ? styles.correctOptionText : null // Applique un texte en vert si l'option est correcte
            ]}
          >
            {`${String.fromCharCode(65 + i)}. ${option.text}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Corriger: {category ? category.title : 'Détails Sujet Direct'}</Text>
      </View>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  correctOptionButton: {
    backgroundColor: '#d4edda', // Vert clair pour l'option correcte
  },
  optionText: {
    fontSize: 14,
  },
  correctOptionText: {
    color: '#155724', // Vert foncé pour le texte de l'option correcte
  },
});

export default Detailscorrigerdirect;
