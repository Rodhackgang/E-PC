import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const Detailssujetprofesionel = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [validated, setValidated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://accompagnement-finale.onrender.com/api/categories');
        const categories = response.data;

        const pedagogieCategories = categories.filter(category => category.title === 'Pédagogie générale');

        const loadedQuestions = pedagogieCategories.flatMap(cat =>
          cat.questions.map(q => ({
            question: q.text,
            options: q.options
          }))
        );

        if (loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
          setDisplayedQuestions(loadedQuestions.slice(0, questionsPerPage));
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleOption = (questionIndex, optionId) => {
    if (validated) return;
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

  const handleContinue = () => {
    const nextIndex = currentIndex + questionsPerPage;
    if (nextIndex >= questions.length) {
      setCurrentIndex(0);
      setDisplayedQuestions(questions.slice(0, questionsPerPage));
    } else {
      setCurrentIndex(nextIndex);
      setDisplayedQuestions(questions.slice(0, nextIndex));
    }
    setSelectedOptions({});
    setValidated(false);
  };

  const handlePlay = () => {
    setValidated(false);
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
              isSelected && !validated ? styles.selectedOption : null,
              isCorrect ? styles.correctOption : null,
              isIncorrect ? styles.incorrectOption : null
            ]}
            onPress={() => toggleOption(index, option._id)}
            disabled={validated}
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
        <Text style={styles.title}>QCM: Pédagogie Générale</Text>
      </View>

      {questions.length === 0 ? (
        <View style={styles.noQuizContainer}>
          <Text style={styles.noQuizText}>Aucun quiz dans cette catégorie</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={displayedQuestions}
            renderItem={renderQuestion}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.content}
          />
          <View style={styles.buttonsContainer}>
            {validated ? (
              <TouchableOpacity onPress={handleContinue} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Continuer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handlePlay} style={styles.actionButtons}>
                <Text style={styles.actionButtonText}>Exercer</Text>
              </TouchableOpacity>
            )}
            {!validated && (
              <TouchableOpacity onPress={validateAnswers} style={styles.validateButton}>
                <Text style={styles.validateButtonText}>Valider</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
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
    backgroundColor: '#009688',
    padding: 16,
    paddingTop: 40,
    elevation: 5, // Shadow effect for header
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#c8e6c9',
  },
  correctOption: {
    backgroundColor: '#c8e6c9',
  },
  incorrectOption: {
    backgroundColor: '#ffcdd2',
  },
  validateButton: {
    backgroundColor: '#009688',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#009688',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtons: {
    backgroundColor: '#009688',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  noQuizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noQuizText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Detailssujetprofesionel;
