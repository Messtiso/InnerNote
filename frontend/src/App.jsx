import { useState } from "react";

function App() {
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSaveEntry = () => {
    if (journalText.trim() === '') {
      return;
    }

    const newEntry = {
      id: Date.now(),
      text: journalText,
      date: new Date().toLocaleDateString()
    };

    setEntries([newEntry, ...entries]);
    setJournalText('');
  };

  return (
    <main>
      <h1>InnerNote</h1>
      <p>Transparent Mood Insights from Everyday Journaling</p>

      <section>
        <h2>Write a journal entry</h2>

        <textarea
        value={journalText}
        onChange={(event) => setJournalText(event.target.value)}
        placeholder="Write about your day..."
        rows="8"
        />

        <br />

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
            <article key={entry.id}>
              <p>{entry.date}</p>
              <p>{entry.text}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
