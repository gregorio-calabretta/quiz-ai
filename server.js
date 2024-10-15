const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const questions = require('./questions');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
// Array in memoria per memorizzare i punteggi
const leaderboard = [];


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'logo')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Aggiungi questo per supportare JSON


app.get('/', (req, res) => {
    res.render('index', { leaderboard }); // Passa la leaderboard al template EJS
});

// Rotta per aggiungere un punteggio alla classifica
app.post('/submit-score', (req, res) => {
    const { name, score } = req.body;

    if (!name || !score) {
        return res.status(400).json({ message: 'Name and score are required.' });
    }

    leaderboard.push({ name, score });
    console.log('Leaderboard updated:', leaderboard); // Debugging
    console.log('Received score:', { name, score });

    res.json({ message: 'Score submitted successfully!' }); // Invia risposta JSON
});



app.post('/quiz', (req, res) => {
    const name = req.body.name;
    res.render('quiz', { name, questions });
});

app.post('/result', (req, res) => {
    let score = 0;
    const name = req.body.name; // Assicurati di passare il nome
    questions.forEach((question, index) => {
        if (req.body[`question-${index}`] === question.correctAnswer) {
            score++;
        }
    });
    // Aggiungi il punteggio alla leaderboard
    leaderboard.push({ name, score });
    res.redirect('/'); // Reindirizza alla pagina principale
});

/*app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/
//server in ascolto su 0.0.0.0 consentendo connessioni da qualsiasi indirizzo IP
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
