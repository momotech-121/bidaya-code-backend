const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({ origin: 'https://incomparable-griffin-cdcc9a.netlify.app' }));

// Connexion MongoDB (remplacez par MongoDB Atlas si souhaité)
mongoose.connect('mongodb://127.0.0.1:27017/bidaya', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion', err));

// Schéma Utilisateur
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progression: { type: Map, of: Number }
});
const User = mongoose.model('User', UserSchema);

// Schéma Cours
const CoursSchema = new mongoose.Schema({
  titre: String,
  contenu: String,
  categorie: String
});
const Cours = mongoose.model('Cours', CoursSchema);

// Routes
app.get('/api/cours', async (req, res) => {
  const cours = await Cours.find();
  res.json(cours);
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    res.status(400).json({ error: 'Email déjà utilisé ou erreur' });
  }
});

app.listen(port, () => console.log(`Serveur sur port ${port}`));

app.get('/api/add-test-course', async (req, res) => {
  const course = new Cours({ titre: "Introduction à Python", contenu: "Apprenez les bases de Python.", categorie: "Informatique" });
  await course.save();
  res.json({ message: 'Cours ajouté' });
});

// Schéma Quiz
const QuizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct: String
});
const Quiz = mongoose.model('Quiz', QuizSchema);

// Route pour récupérer les quiz
app.get('/api/quiz', async (req, res) => {
  const quiz = await Quiz.find();
  res.json(quiz);
});

// Route pour ajouter un quiz de test
app.get('/api/add-test-quiz', async (req, res) => {
  const quiz = new Quiz({
    question: "Quelle est la capitale de la France ?",
    options: ["Paris", "Lyon", "Marseille"],
    correct: "Paris"
  });
  await quiz.save();
  res.json({ message: 'Quiz ajouté' });
});