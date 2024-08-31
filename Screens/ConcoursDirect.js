import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

// Images
const sujetImage = require('../assets/images/memoir.jpeg');
const corrigesImage = require('../assets/images/corriger.png');
const qcmImage = require('../assets/images/qcm.jpeg');

const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('concoursDirect.db');
};

const createTables = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      categoryId TEXT,
      text TEXT,
      correctAnswer TEXT,
      FOREIGN KEY (categoryId) REFERENCES categories (id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      questionId TEXT,
      text TEXT,
      isCorrect INTEGER,
      FOREIGN KEY (questionId) REFERENCES questions (id)
    );
  `);
};

const saveCategories = async (db, categories) => {
  for (const category of categories) {
    await db.runAsync(
      `INSERT OR REPLACE INTO categories (id, title, description) VALUES (?, ?, ?);`,
      [category._id, category.title, category.description]
    );
    console.log(`Catégorie sauvegardée: ${category.title}`); // Log pour vérifier
  }
};

const getLocalCategories = async (db) => {
  const rows = await db.getAllAsync("SELECT * FROM categories;");
  return rows.map(row => ({
    _id: row.id,
    title: row.title,
    description: row.description,
  }));
};
const validateQuestionData = (question) => {
  return question._id && question.text && Array.isArray(question.answers) && question.answers.length > 0;
};

const saveQuestions = async (db, categoryId, questions) => {
  await db.transactionAsync(async (txn) => {
    for (const question of questions) {
      if (!validateQuestionData(question)) {
        console.error(`Invalid question data: ${JSON.stringify(question)}`);
        continue;
      }

      await txn.runAsync(
        `INSERT OR REPLACE INTO questions (id, categoryId, text, correctAnswer) VALUES (?, ?, ?, ?);`,
        [question._id, categoryId, question.text, question.correctAnswer]
      );
      console.log(`Question sauvegardée: ${question.text}`);

      for (const answer of question.answers) {
        await txn.runAsync(
          `INSERT OR REPLACE INTO answers (id, questionId, text, isCorrect) VALUES (?, ?, ?, ?);`,
          [answer._id, question._id, answer.text, answer.isCorrect ? 1 : 0]
        );
        console.log(`Réponse sauvegardée: ${answer.text}`);
      }
    }
  });
};


const getLocalQuestions = async (db, categoryId) => {
  const questionsRows = await db.getAllAsync("SELECT * FROM questions WHERE categoryId = ?;", [categoryId]);
  console.log("Questions récupérées de la base de données:", questionsRows); // Log pour vérifier

  const questions = [];

  for (const questionRow of questionsRows) {
    const answersRows = await db.getAllAsync("SELECT * FROM answers WHERE questionId = ?;", [questionRow.id]);
    console.log(`Réponses pour la question ${questionRow.id}:`, answersRows); // Log pour vérifier

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


const Card = ({ title, image, buttonTitle, onButtonPress }) => (
  <View style={styles.card}>
    <Image source={image} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{title}</Text>
    {buttonTitle && (
      <TouchableOpacity style={styles.cardButton} onPress={onButtonPress}>
        <Text style={styles.cardButtonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function ConcoursDirect() {
  const navigation = useNavigation();
  const [subjects, setSubjects] = useState([]);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const fetchData = async (db) => {
      try {
        const localSubjects = await getLocalCategories(db);
        console.log("Local subjects:", localSubjects);
        setSubjects(localSubjects);

        if (isConnected) {
          const response = await axios.get('https://accompagnement-finale.onrender.com/api/categories');
          console.log("API response:", response.data);
          const subjectsFromAPI = response.data;
          setSubjects(subjectsFromAPI);
          await saveCategories(db, subjectsFromAPI); // Update local data
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sujets :", error);
      }
    };

    const initializeDatabase = async () => {
      const db = await openDatabase();
      await db.execAsync("PRAGMA journal_mode = WAL;");
      await createTables(db);
      fetchData(db); // Fetch data on initialization
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        initializeDatabase(); // Re-fetch data when connection is restored
      }
    });

    initializeDatabase();

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [isConnected]);

  const Detailscorrigerdirect = (category) => {
    navigation.navigate('Detailscorrigerdirect', { category });
  };

  const sujetDetail = async (category) => {
    navigation.navigate('Detailssujetdirect', { category});
  };
  

  const Detailsqcmdirect = (category) => {
    navigation.navigate('Detailsqcmdirect', { category });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Section des Sujets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScrollView}>
          {subjects
            .filter(subject => subject.title !== "Pédagogie générale")
            .map((subject, index) => (
              <TouchableOpacity key={index} onPress={() => sujetDetail(subject)}>
                <Card title={`Sujet ${index + 1}`} image={sujetImage} />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
  
      <View style={styles.section}>
        <Text style={styles.title}>Section des Corrigés</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScrollView}>
          {subjects
            .filter(subject => subject.title !== "Pédagogie générale")
            .map((subject, index) => (
              <TouchableOpacity key={index} onPress={() => Detailscorrigerdirect(subject)}>
                <Card title={`Corrigé ${index + 1}`} image={corrigesImage} />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
  
      <View style={styles.section}>
        <Text style={styles.title}>Section des QCM</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScrollView}>
          {subjects
            .filter(subject => subject.title !== "Pédagogie générale")
            .map((subject, index) => (
              <Card
                key={index}
                title={`QCM ${index + 1}`}
                image={qcmImage}
                buttonTitle="Exercer"
                onButtonPress={() => Detailsqcmdirect(subject)}
              />
            ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardsScrollView: {
    flexDirection: 'row',
  },
  card: {
    width: 150,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 15,
    padding: 15,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#0A84FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
