document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit-button").addEventListener("click", function() {
        const username = document.getElementById("name").value; // Qui sarà sicuro
        const score = calculateScore(questions); // Assicurati che questions sia definito
        console.log(username);
        console.log(score);
        submitScore(username, score);
    });


    function calculateScore(questions) {
        let score = 0;
        questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                score++;
            }
        });
        return score; // Restituisci il punteggio finale
    }

    function submitScore(username, score) {
        const params = new URLSearchParams();
        params.append('name', username);
        params.append('score', score);

        fetch('/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Cambia il tipo di contenuto
            },
            body: params.toString(), // Converte i parametri in una stringa
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('Success:', data);
            // Riavvia il quiz o mostra un messaggio di conferma se necessario
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

function startQuiz() {
    // ... codice esistente per iniziare il quiz ...
    {{ mostraQuiz() }}
    // ... codice esistente per gestire il quiz ...
    {{ mostraRisultato() }}
    // ... codice esistente per tornare all'indice ...
    {{ mostraTuttiIRisultati() }}
}
