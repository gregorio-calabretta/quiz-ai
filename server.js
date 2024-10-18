const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const questions = require('./questions');
const axios = require('axios');

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

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; font-src 'self' http://localhost:3000; img-src 'self' data:;");
    next();
});

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
    const name = req.body.name || 'Pippo'; // Usa 'Pippo' come nome di default
    questions.forEach((question, index) => {
        if (req.body[`question-${index}`] === question.correctAnswer) {
            score++;
        }
    });
    // Aggiungi il punteggio alla leaderboard
    leaderboard.push({ name, score });
    res.render('result', { name, score, leaderboard });
});
// Rotta per ottenere la leaderboard
app.get('/get-leaderboard', (req, res) => {
    res.json({ leaderboard });
});
/*app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/
//server in ascolto su 0.0.0.0 consentendo connessioni da qualsiasi indirizzo IP
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Funzione per generare domande
async function generateQuizQuestions(topic) {
    const apiKey = 'ciao'; 
    const prompt = `Genera 5 domande di quiz su "${topic}" con le seguenti specifiche, rispondi direttamente con le domande in formato JSON:
    Ogni domanda deve avere i seguenti campi:
    - "id": un numero identificativo,
    - "question": la domanda,
    - "answers": un array con 4 possibili risposte,
    - "correctAnswer": la risposta corretta.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        // Log della risposta completa per il debugging
        console.log('Response from API:', JSON.stringify(response.data, null, 2));

        // Controlla se la risposta contiene il messaggio previsto
        const messageContent = response.data.choices[0].message.content;

        // Rimuovi i caratteri di formattazione
        const jsonString = messageContent.replace(/```json|```/g, '').trim();

        // Prova a convertire il contenuto in JSON
        const questions = JSON.parse(jsonString);
        return questions; // Restituisce le domande generate
    } catch (error) {
        console.error('Error generating questions:', error);
        return null; // Restituisce null in caso di errore
    }
}

app.post('/generate-quiz', async (req, res) => {
    const { topic } = req.body; // Ottieni l'argomento dal corpo della richiesta
    const questions = await generateQuizQuestions(topic);

    if (Array.isArray(questions)) { // Controlla se questions è un array
        res.json({ questions }); // Restituisce le domande generate come risposta JSON
    } else {
        res.status(500).json({ error: 'Errore nella generazione delle domande.' });
    }
});

app.get('/quiz', (req, res) => {
    const questions = JSON.parse(decodeURIComponent(req.query.questions)); // Decodifica e analizza le domande
    res.render('quiz', { questions });
});

