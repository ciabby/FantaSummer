// Incolla qui la tua configurazione Firebase ottenuta dalla Console
const firebaseConfig = {
    apiKey: "AIzaSyC-WWI-DuRhvJiP4fPHLsXsYor0txXnuOk",
    authDomain: "fantasummerdatabase.firebaseapp.com",
    projectId: "fantasummerdatabase",
    storageBucket: "fantasummerdatabase.firebasestorage.app",
    messagingSenderId: "762953843954",
    appId: "1:762953843954:web:33487ba79d1e4f1f96fc6b",
    measurementId: "G-H8CJYQJ4VH"
};

// Inizializza Firebase usando la sintassi compat (vecchia sintassi)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Inizializza Firestore

// Collezioni di Firestore
const playersCollection = db.collection('players');
const challengesCollection = db.collection('challenges');

document.addEventListener('DOMContentLoaded', function() {
    // Placeholder images (sostituisci con i tuoi URL reali o percorsi locali se li hai)
    document.getElementById('summer-logo').src = 'foto/logo.png';
    document.getElementById('spiderman-img').src = 'foto/spiderman.png';
    document.getElementById('man-img').src = 'foto/ti piace.png';

    // Mostra il contenuto iniziale
    showContent('home');
});

// Funzione principale per mostrare i contenuti
function showContent(contentType) {
    const contentArea = document.getElementById('content-area');
    let contentHtml = '';

    // Nascondi le immagini nel main-content quando si visualizza un contenuto specifico
    document.getElementById('summer-logo').style.display = 'none';
    document.getElementById('spiderman-img').style.display = 'none';
    document.getElementById('man-img').style.display = 'none';

    switch (contentType) {
        case 'home':
            contentHtml = `
                <h2>Benvenuto al Fanta Summer!</h2>
                <p>Seleziona un'opzione dalla barra laterale per gestire il tuo Fanta Summer.</p>
            `;
            // Mostra le immagini solo nella homepage
            document.getElementById('summer-logo').style.display = 'block';
            document.getElementById('spiderman-img').style.display = 'block';
            document.getElementById('man-img').style.display = 'block';
            break;

        case 'punti-giocatori':
            contentHtml = `
                <h2>Punteggio Giocatori</h2>
                <p>Qui verrà visualizzata la tabella con i punteggi attuali di tutti i giocatori.</p>
                <div id="points-table-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Giocatore</th>
                                <th>Punti</th>
                            </tr>
                        </thead>
                        <tbody id="player-points-body">
                            </tbody>
                    </table>
                </div>
            `;
            contentArea.innerHTML = contentHtml; // Inserisci il template prima di caricare i dati
            loadPlayerScores(); // Carica i dati dei giocatori
            break;

        case 'aggiungi-sfida':
            contentHtml = `
                <h2>Aggiungi Nuova Sfida</h2>
                <p>Compila il modulo per aggiungere una nuova sfida al Fanta Summer.</p>
                <div id="challenge-form-content">
                    <form id="add-challenge-form">
                        <label for="challenge-name">Nome Sfida:</label>
                        <input type="text" id="challenge-name" name="challenge-name" required>
                        <label for="challenge-value">Valore Sfida (punti):</label>
                        <input type="number" id="challenge-value" name="challenge-value" min="1" required>
                        <button type="submit">Aggiungi Sfida</button>
                    </form>
                    <p id="challenge-message" style="color: green;"></p>
                </div>
            `;
            contentArea.innerHTML = contentHtml;
            // Aggiungi l'event listener al form DOPO che è stato inserito nel DOM
            document.getElementById('add-challenge-form').addEventListener('submit', addChallenge);
            break;

        case 'visualizza-sfide':
            contentHtml = `
                <h2>Visualizza Sfide</h2>
                <p>Ecco l'elenco delle sfide disponibili e il loro valore. Puoi anche eliminarle.</p>
                <div id="challenge-list-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Sfida</th>
                                <th>Valore Punti</th>
                                <th>Azione</th> </tr>
                        </thead>
                        <tbody id="challenge-list-body">
                            </tbody>
                    </table>
                </div>
            `;
            contentArea.innerHTML = contentHtml;
            loadChallenges();
            break;

        case 'assegna-punti':
            contentHtml = `
                <h2>Assegna Punti a Giocatore</h2>
                <p>Seleziona un giocatore e la sfida completata per assegnare i punti.</p>
                <div id="assign-points-form-content">
                    <form id="assign-points-form">
                        <label for="player-select">Seleziona Giocatore:</label>
                        <select id="player-select" name="player-select" required>
                            </select>
                        <label for="challenge-select">Seleziona Sfida Completata:</label>
                        <select id="challenge-select" name="challenge-select" required>
                            </select>
                        <button type="submit">Assegna Punti Sfida</button>
                    </form>
                    <p id="assign-points-message" style="color: green;"></p>
                </div>
            `;
            contentArea.innerHTML = contentHtml;
            populatePlayerSelect(); // Popola il dropdown dei giocatori
            populateChallengeSelect(); // NUOVO: Popola il dropdown delle sfide
            document.getElementById('assign-points-form').addEventListener('submit', assignPointsToPlayer);
            break;

        case 'aggiungi-giocatore':
            contentHtml = `
                <h2>Aggiungi Nuovo Giocatore</h2>
                <p>Inserisci il nome del nuovo partecipante al Fanta Summer.</p>
                <div id="add-player-form-content">
                    <form id="add-player-form">
                        <label for="new-player-name">Nome Giocatore:</label>
                        <input type="text" id="new-player-name" name="new-player-name" required>
                        <button type="submit">Aggiungi Giocatore</button>
                    </form>
                    <p id="player-message" style="color: green;"></p>
                </div>
            `;
            contentArea.innerHTML = contentHtml;
            document.getElementById('add-player-form').addEventListener('submit', addPlayer);
            break;

        case 'visualizza-giocatori':
            contentHtml = `
                <h2>Visualizza Giocatori</h2>
                <p>Ecco l'elenco di tutti i partecipanti al Fanta Summer.</p>
                <div id="player-list-content">
                    <ul id="player-list-ul">
                        </ul>
                </div>
            `;
            contentArea.innerHTML = contentHtml;
            loadPlayersList();
            break;

        default:
            contentHtml = `
                <h2>Contenuto Non Trovato</h2>
                <p>Si prega di selezionare un'opzione valida.</p>
            `;
            contentArea.innerHTML = contentHtml;
            break;
    }
}

// --- Funzioni per interazione con Firestore ---

// Funzione per aggiungere un nuovo giocatore
async function addPlayer(event) {
    event.preventDefault();
    const playerNameInput = document.getElementById('new-player-name');
    const playerName = playerNameInput.value.trim();
    const playerMessage = document.getElementById('player-message');

    if (playerName) {
        try {
            // Controlla se il giocatore esiste già (opzionale, ma buona pratica)
            const existingPlayers = await playersCollection.where('name', '==', playerName).get();
            if (!existingPlayers.empty) {
                playerMessage.textContent = `Errore: Il giocatore "${playerName}" esiste già.`;
                playerMessage.style.color = 'orange';
                return;
            }

            await playersCollection.add({
                name: playerName,
                points: 0 // Ogni nuovo giocatore inizia con 0 punti
            });
            playerMessage.textContent = `Giocatore "${playerName}" aggiunto con successo!`;
            playerMessage.style.color = 'green'; // Assicurati che il colore sia verde per il successo
            playerNameInput.value = ''; // Pulisci il campo
            // Ricarica la lista dei giocatori se la si sta visualizzando
            if (document.getElementById('player-list-ul')) {
                loadPlayersList();
            }
            // Ricarica il selettore giocatori per assegnare punti
            if (document.getElementById('player-select')) {
                populatePlayerSelect();
            }
        } catch (e) {
            console.error("Errore nell'aggiungere il giocatore: ", e);
            playerMessage.textContent = `Errore: Impossibile aggiungere il giocatore.`;
            playerMessage.style.color = 'red';
        }
    } else {
        playerMessage.textContent = 'Il nome del giocatore non può essere vuoto.';
        playerMessage.style.color = 'orange';
    }
}

// Funzione per caricare e visualizzare la lista dei giocatori
async function loadPlayersList() {
    const playerListUl = document.getElementById('player-list-ul');
    playerListUl.innerHTML = '<li>Caricamento giocatori...</li>';

    try {
        const snapshot = await playersCollection.orderBy('name').get(); // Ordina per nome
        playerListUl.innerHTML = ''; // Pulisci la lista

        if (snapshot.empty) {
            playerListUl.innerHTML = '<li>Nessun giocatore aggiunto ancora.</li>';
            return;
        }

        snapshot.forEach(doc => {
            const player = doc.data();
            const li = document.createElement('li');
            li.textContent = player.name;
            playerListUl.appendChild(li);
        });
    } catch (e) {
        console.error("Errore nel caricare i giocatori: ", e);
        playerListUl.innerHTML = '<li>Errore nel caricare i giocatori.</li>';
        playerListUl.style.color = 'red';
    }
}

// Funzione per caricare e visualizzare i punteggi dei giocatori
async function loadPlayerScores() {
    const playerPointsBody = document.getElementById('player-points-body');
    playerPointsBody.innerHTML = '<tr><td colspan="2">Caricamento punteggi...</td></tr>';

    try {
        const snapshot = await playersCollection.orderBy('points', 'desc').get(); // Ordina per punti decrescenti
        playerPointsBody.innerHTML = ''; // Pulisci la tabella

        if (snapshot.empty) {
            playerPointsBody.innerHTML = '<tr><td colspan="2">Nessun punteggio da visualizzare.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const player = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${player.name}</td><td>${player.points}</td>`;
            playerPointsBody.appendChild(tr);
        });
    } catch (e) {
        console.error("Errore nel caricare i punteggi: ", e);
        playerPointsBody.innerHTML = '<tr><td colspan="2" style="color:red;">Errore nel caricare i punteggi.</td></tr>';
    }
}

// Funzione per aggiungere una nuova sfida
async function addChallenge(event) {
    event.preventDefault();
    const challengeNameInput = document.getElementById('challenge-name');
    const challengeValueInput = document.getElementById('challenge-value');
    const challengeMessage = document.getElementById('challenge-message');

    const name = challengeNameInput.value.trim();
    const value = parseInt(challengeValueInput.value);

    if (name && value > 0) {
        try {
            // Controlla se la sfida esiste già (opzionale)
            const existingChallenges = await challengesCollection.where('name', '==', name).get();
            if (!existingChallenges.empty) {
                challengeMessage.textContent = `Errore: La sfida "${name}" esiste già.`;
                challengeMessage.style.color = 'orange';
                return;
            }

            await challengesCollection.add({
                name: name,
                value: value
            });
            challengeMessage.textContent = `Sfida "${name}" (Valore: ${value} punti) aggiunta con successo!`;
            challengeMessage.style.color = 'green';
            challengeNameInput.value = '';
            challengeValueInput.value = '';
            // Ricarica la lista delle sfide se la si sta visualizzando
            if (document.getElementById('challenge-list-body')) {
                loadChallenges();
            }
            // Ricarica il selettore sfide per assegnare punti
            if (document.getElementById('challenge-select')) {
                populateChallengeSelect();
            }
        } catch (e) {
            console.error("Errore nell'aggiungere la sfida: ", e);
            challengeMessage.textContent = `Errore: Impossibile aggiungere la sfida.`;
            challengeMessage.style.color = 'red';
        }
    } else {
        challengeMessage.textContent = 'Il nome della sfida e il valore punti sono richiesti e validi.';
        challengeMessage.style.color = 'orange';
    }
}

// Funzione per caricare e visualizzare le sfide (con pulsante elimina)
async function loadChallenges() {
    const challengeListBody = document.getElementById('challenge-list-body');
    challengeListBody.innerHTML = '<tr><td colspan="3">Caricamento sfide...</td></tr>'; // Nota: colspan 3

    try {
        const snapshot = await challengesCollection.orderBy('name').get(); // Ordina per nome
        challengeListBody.innerHTML = ''; // Pulisci la tabella

        if (snapshot.empty) {
            challengeListBody.innerHTML = '<tr><td colspan="3">Nessuna sfida aggiunta ancora.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const challenge = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${challenge.name}</td>
                <td>${challenge.value}</td>
                <td><button class="delete-button" data-id="${doc.id}">Elimina</button></td>
            `;
            challengeListBody.appendChild(tr);
        });

        // Aggiungi event listener a tutti i pulsanti "Elimina"
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const challengeId = event.target.dataset.id;
                if (confirm('Sei sicuro di voler eliminare questa sfida?')) {
                    deleteChallenge(challengeId);
                }
            });
        });

    } catch (e) {
        console.error("Errore nel caricare le sfide: ", e);
        challengeListBody.innerHTML = '<tr><td colspan="3" style="color:red;">Errore nel caricare le sfide.</td></tr>';
    }
}

// NUOVO: Funzione per eliminare una sfida
async function deleteChallenge(challengeId) {
    try {
        await challengesCollection.doc(challengeId).delete();
        alert('Sfida eliminata con successo!');
        loadChallenges(); // Ricarica la lista delle sfide dopo l'eliminazione
        populateChallengeSelect(); // Aggiorna anche il selettore sfide se aperto
    } catch (e) {
        console.error("Errore nell'eliminare la sfida: ", e);
        alert('Errore: Impossibile eliminare la sfida.');
    }
}


// Funzione per popolare il selettore giocatori per l'assegnazione punti
async function populatePlayerSelect() {
    const playerSelect = document.getElementById('player-select');
    playerSelect.innerHTML = '<option value="">Caricamento giocatori...</option>'; // Placeholder

    try {
        const snapshot = await playersCollection.orderBy('name').get();
        playerSelect.innerHTML = '<option value="" disabled selected>Seleziona un giocatore</option>'; // Opzione di default

        if (snapshot.empty) {
            playerSelect.innerHTML = '<option value="" disabled>Nessun giocatore disponibile</option>';
            return;
        }

        snapshot.forEach(doc => {
            const player = doc.data();
            const option = document.createElement('option');
            option.value = doc.id; // Salva l'ID del documento di Firestore
            option.textContent = player.name;
            playerSelect.appendChild(option);
        });
    } catch (e) {
        console.error("Errore nel popolare il selettore giocatori: ", e);
        playerSelect.innerHTML = '<option value="" disabled>Errore nel caricamento</option>';
    }
}

// NUOVO: Funzione per popolare il selettore sfide per l'assegnazione punti
async function populateChallengeSelect() {
    const challengeSelect = document.getElementById('challenge-select');
    challengeSelect.innerHTML = '<option value="">Caricamento sfide...</option>'; // Placeholder

    try {
        const snapshot = await challengesCollection.orderBy('name').get();
        challengeSelect.innerHTML = '<option value="" disabled selected>Seleziona una sfida</option>'; // Opzione di default

        if (snapshot.empty) {
            challengeSelect.innerHTML = '<option value="" disabled>Nessuna sfida disponibile</option>';
            return;
        }

        snapshot.forEach(doc => {
            const challenge = doc.data();
            const option = document.createElement('option');
            option.value = doc.id; // Salva l'ID del documento di Firestore
            option.textContent = `${challenge.name} (${challenge.value} punti)`; // Mostra nome e punti
            option.dataset.points = challenge.value; // Salva i punti come data attribute
            challengeSelect.appendChild(option);
        });
    } catch (e) {
        console.error("Errore nel popolare il selettore sfide: ", e);
        challengeSelect.innerHTML = '<option value="" disabled>Errore nel caricamento</option>';
    }
}

// Funzione per assegnare punti a un giocatore (basandosi sulla sfida)
async function assignPointsToPlayer(event) {
    event.preventDefault();
    const playerSelect = document.getElementById('player-select');
    const challengeSelect = document.getElementById('challenge-select'); // NUOVO: Ottieni il selettore sfida
    const assignPointsMessage = document.getElementById('assign-points-message');

    const playerId = playerSelect.value;
    const challengeId = challengeSelect.value; // NUOVO: Ottieni l'ID della sfida
    const points = parseInt(challengeSelect.options[challengeSelect.selectedIndex].dataset.points); // NUOVO: Prendi i punti dal data-attribute della sfida

    if (playerId && challengeId && points > 0) {
        try {
            const playerRef = playersCollection.doc(playerId);
            await playerRef.update({
                points: firebase.firestore.FieldValue.increment(points) // Incrementa i punti esistenti
            });
            assignPointsMessage.textContent = `Assegnati ${points} punti al giocatore!`;
            assignPointsMessage.style.color = 'green';
            playerSelect.value = ''; // Resetta il selettore giocatore
            challengeSelect.value = ''; // Resetta il selettore sfida
            // Ricarica la tabella dei punteggi se la si sta visualizzando
            if (document.getElementById('player-points-body')) {
                loadPlayerScores();
            }
        } catch (e) {
            console.error("Errore nell'assegnare punti: ", e);
            assignPointsMessage.textContent = `Errore: Impossibile assegnare i punti.`;
            assignPointsMessage.style.color = 'red';
        }
    } else {
        assignPointsMessage.textContent = 'Seleziona un giocatore e una sfida valida.';
        assignPointsMessage.style.color = 'orange';
    }
}

// Basic search functionality (client-side only for demonstration)
document.getElementById('search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const sidebarButtons = document.querySelectorAll('.sidebar-button');

    sidebarButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes(searchTerm)) {
            button.style.display = 'block'; // Show button
        } else {
            button.style.display = 'none'; // Hide button
        }
    });

    // In a real application, this would trigger a backend search
    // and dynamically update the main content area with search results.
    if (searchTerm.length > 0) {
        // Puoi aggiungere qui una logica per filtrare anche il contenuto caricato, se desideri.
    } else {
        // Reset sidebar buttons display if search term is empty
        sidebarButtons.forEach(button => {
            button.style.display = 'block';
        });
    }
});