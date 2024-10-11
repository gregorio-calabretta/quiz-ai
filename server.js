const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const questions = require('./questions');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/quiz', (req, res) => {
    const name = req.body.name;
    res.render('quiz', { name, questions });
});

app.post('/result', (req, res) => {
    let score = 0;
    questions.forEach((question, index) => {
        if (req.body[`question-${index}`] === question.correctAnswer) {
            score++;
        }
    });
    res.render('result', { score, total: questions.length });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
