# Quiz App

Questa è un'applicazione web di quiz interattiva costruita con Node.js, Express e EJS. L'app permette agli utenti di partecipare a un quiz, visualizzare i loro punteggi e vedere una classifica dei migliori punteggi.

## Caratteristiche

- Quiz interattivo con domande a scelta multipla
- Classifica dei punteggi in tempo reale
- Design responsive per dispositivi mobili e desktop
- Interfaccia utente intuitiva e accattivante

## Tecnologie Utilizzate

- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- CSS3
- JavaScript (ES6+)

## Installazione

1. Clona il repository:
   ```
   git clone https://github.com/tuousername/quiz-app.git
   ```

2. Naviga nella directory del progetto:
   ```
   cd quiz-app
   ```

3. Installa le dipendenze:
   ```
   npm install
   ```

4. Avvia il server:
   ```
   npm start
   ```

5. Apri il browser e vai a `http://localhost:3000`

## Struttura del Progetto

- `server.js`: Il file principale del server Express
- `questions.js`: Contiene l'array delle domande del quiz
- `views/`: Contiene i template EJS
  - `index.ejs`: La pagina principale
  - `quiz.ejs`: La pagina del quiz
  - `result.ejs`: La pagina dei risultati
- `public/`: Contiene i file statici
  - `styles.css`: Foglio di stile principale
  - `js/score.js`: Script per la gestione del punteggio
- `logo/`: Contiene il logo dell'applicazione

