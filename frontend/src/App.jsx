import { useState } from "react";

function App() {
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSaveEntry = async () => {
    if (journalText.trim() === '') {
      return;
    }

    const response = await fetch('http://localhost:5000/api/analyse', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        journalText: journalText
        })
      });
    
    const analysis = await response.json();

    const newEntry = {
      id: Date.now(),
      text: journalText,
      date: new Date().toLocaleDateString(),
      mood: analysis.mood,
      score: analysis.score,
      keywords: analysis.keywords
    };

    setEntries([newEntry, ...entries]);
    setJournalText('');
  };

  return (
    <main>
      <header>
        <h1>InnerNote</h1>
        <p>Transparent Mood Insights from Everyday Journaling</p>
      </header>

      <section>
        <h2>Write a journal entry</h2>

        <textarea
        value={journalText}
        onChange={(event) => setJournalText(event.target.value)}
        placeholder="Write about your day..."
        rows="8"
        />

        <br />
        <p className="character-count">
          {journalText.length} character
        </p>
        <button onClick={handleSaveEntry}>
          Save Entry
        </button>
      </section>

      <section>
        <h2>Previous Entries</h2>

        {entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <article className="entry-card" key={entry.id}>
              <p className="entry-date">{entry.date}</p>

              <p>{entry.text}</p>

              <p>
                <strong>Mood:</strong> {entry.mood}
              </p>

              <p>
                <strong>Score:</strong> {entry.score}
              </p>

              <p>
                <strong>Keywords:</strong>{' '}
                {entry.keywords.length > 0
                  ? entry.keywords.join(', ')
                  : 'None detected'}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
