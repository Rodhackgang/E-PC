import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Detailsqcmdirect = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (category && category.questions) {
      console.log("Category data:", category);
      const loadedQuestions = category.questions.map(q => ({
        question: q.text,
        options: q.options
      }));
      setQuestions(loadedQuestions);
    } else {
      console.log("Category or questions not available.");
    }
  }, [category]);

  const toggleOption = (questionIndex, optionId) => {
    if (validated) return; // Ne permet pas de changer les options après validation
    setSelectedOptions(prevState => {
      const updated = { ...prevState };
      if (!updated[questionIndex]) {
        updated[questionIndex] = [];
      }
      if (updated[questionIndex].includes(optionId)) {
        updated[questionIndex] = updated[questionIndex].filter(id => id !== optionId);
      } else {
        updated[questionIndex].push(optionId);
      }
      return updated;
    });
  };

  const validateAnswers = () => {
    setValidated(true);
  };

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionContainer} key={index}>
      <Text style={styles.questionText}>{`${index + 1}. ${item.question}`}</Text>
      {item.options.map((option, i) => {
        const isSelected = selectedOptions[index]?.includes(option._id);
        const isCorrect = validated && option.isCorrect;
        const isIncorrect = validated && isSelected && !option.isCorrect;

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionButton,
              isSelected && !validated ? styles.selectedOption : null, // Si sélectionné avant validation
              isCorrect ? styles.correctOption : null, // Si correct après validation
              isIncorrect ? styles.incorrectOption : null // Si incorrect après validation
            ]}
            onPress={() => toggleOption(index, option._id)}
            disabled={validated} // Désactive la sélection après validation
          >
            <Text style={styles.optionText}>{`${String.fromCharCode(65 + i)}. ${option.text}`}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Détails QCM: {category ? category.title : 'Détails Sujet Direct'}</Text>
      </View>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.content}
      />
      <TouchableOpacity onPress={validateAnswers} style={styles.validateButton}>
        <Text style={styles.validateButtonText}>Valider</Text>
      </TouchableOpacity>
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
  selectedOption: {
    backgroundColor: '#d0f0c0', // Vert clair pour les options sélectionnées
  },
  correctOption: {
    backgroundColor: '#c8e6c9', // Vert pour les réponses correctes
  },
  incorrectOption: {
    backgroundColor: '#ffcdd2', // Rouge pour les réponses incorrectes
  },
  validateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Detailsqcmdirect;
