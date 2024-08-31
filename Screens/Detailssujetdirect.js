import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

// Ouvre la base de données
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('concoursDirect.db');
};

// Récupère les questions depuis la base de données locale
const getLocalQuestions = async (db, categoryId) => {
  const questionsRows = await db.getAllAsync("SELECT * FROM questions WHERE categoryId = ?;", [categoryId]);
  const questions = [];

  for (const questionRow of questionsRows) {
    const answersRows = await db.getAllAsync("SELECT * FROM answers WHERE questionId = ?;", [questionRow.id]);
    const answers = answersRows.map(answerRow => ({
      _id: answerRow.id,
      text: answerRow.text,
      isCorrect: answerRow.isCorrect === 1
    }));

    questions.push({
      _id: questionRow.id,
      text: questionRow.text,
      answers,
      correctAnswer: questionRow.correctAnswer
    });
  }

  return questions;
};

// Enregistre les questions dans la base de données locale
const saveQuestions = async (db, categoryId, questions) => {
  await db.transactionAsync(async (txn) => {
    for (const question of questions) {
      await txn.runAsync(
        `INSERT OR REPLACE INTO questions (id, categoryId, text, correctAnswer) VALUES (?, ?, ?, ?);`,
        [question._id, categoryId, question.text, question.correctAnswer]
      );

      for (const answer of question.answers) {
        await txn.runAsync(
          `INSERT OR REPLACE INTO answers (id, questionId, text, isCorrect) VALUES (?, ?, ?, ?);`,
          [answer._id, question._id, answer.text, answer.isCorrect ? 1 : 0]
        );
      }
    }
  });
};

const Detailssujetdirect = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const db = await openDatabase();

      // Si connecté, récupérer les questions depuis l'API et sauvegarder en local
      if (isConnected) {
        try {
          const response = await axios.get(`https://accompagnement-finale.onrender.com/api/categories`);
          const categoriesFromAPI = response.data;

          // Trouver la catégorie correspondant à celle sélectionnée
          const selectedCategory = categoriesFromAPI.find(cat => cat._id === category._id);

          if (selectedCategory && selectedCategory.questions) {
            setQuestions(selectedCategory.questions);
            await saveQuestions(db, selectedCategory._id, selectedCategory.questions);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des questions :", error);
        }
      } else {
        // Si pas connecté, charger les questions depuis la base de données locale
        const localQuestions = await getLocalQuestions(db, category._id);
        setQuestions(localQuestions);
      }
    };

    fetchQuestions();

    // Écouter les changements de connexion
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchQuestions(); // Re-fetch questions when connection is restored
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [isConnected, category]);

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionContainer} key={index}>
      <Text style={styles.questionText}>{`${index + 1}. ${item.text}`}</Text>
      {item.options.map((option, i) => (
        <TouchableOpacity key={i} style={styles.optionButton}>
          <Text style={styles.optionText}>{`${String.fromCharCode(65 + i)}. ${option.text}`}</Text>
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
        <Text style={styles.title}>{category ? category.title : 'Détails Sujet Direct'}</Text>
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
  optionText: {
    fontSize: 14,
  },
});

export default Detailssujetdirect;
