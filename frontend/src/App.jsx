import { useEffect, useState } from "react";

function App() {
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/entries');
      const data = await response.json();

      setEntries(data);
    } catch (error) {
      console.log('Error fetching entries:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${entryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Could not delete entry');
      }

      setEntries(entries.filter((entry) => entry._id !== entryId));
    } catch (error) {
      setErrorMessage('Could not delete entry. Please try again.');
    }
  };

  const handleSaveEntry = async () => {
    if (journalText.trim() === '') {
      setErrorMessage('Please write something before saving.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          journalText: journalText
        })
      });

      if (!response.ok) {
        throw new Error('Something went wrong while analysing your entry.');
      }

      const analysis = await response.json();

      const newEntry = {
        id: Date.now(),
        text: journalText,
        date: new Date().toLocaleString(),
        mood: analysis.mood,
        score: analysis.score,
        keywords: analysis.keywords
      };

      setEntries([newEntry, ...entries]);
      setJournalText('');
    } catch (error) {
      setErrorMessage('Could not analyse your entry. Please check that the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalEntries = entries.length;

  const positiveEntries = entries.filter((entry) => entry.mood === 'positive').length;
  const neutralEntries = entries.filter((entry) => entry.mood === 'neutral').length;
  const negativeEntries = entries.filter((entry) => entry.mood === 'negative').length;

  const averageMoodScore =
    totalEntries > 0
      ? (entries.reduce((total, entry) => total + entry.score, 0) / totalEntries).toFixed(1)
      : 0;

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
          {journalText.length} characters
        </p>

        {errorMessage && (
          <p className="error-message">
            {errorMessage}
          </p>
        )}

        <button onClick={handleSaveEntry} disabled={isLoading}>
          {isLoading ? 'Analysing mood...' : 'Save Entry'}
        </button>
      </section>

      <section>
        <h2>Mood Summary</h2>

        {totalEntries === 0 ? (
          <p>No mood data available yet.</p>
        ) : (
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Total Entries</h3>
              <p>{totalEntries}</p>
            </div>

            <div className="summary-card">
              <h3>Average Mood Score</h3>
              <p>{averageMoodScore}</p>
            </div>

            <div className="summary-card">
              <h3>Positive</h3>
              <p>{positiveEntries}</p>
            </div>

            <div className="summary-card">
              <h3>Neutral</h3>
              <p>{neutralEntries}</p>
            </div>

            <div className="summary-card">
              <h3>Negative</h3>
              <p>{negativeEntries}</p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2>Previous Entries</h2>

        {entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <article
              className={`entry-card mood-${entry.mood}`}
              key={entry._id || entry.id}
            >
              <p className="entry-date">
                {entry.createdAt || entry.date
                  ? new Date(entry.createdAt || entry.date).toLocaleString()
                  : 'Recently added'}
              </p>

              <div className={`mood-badge badge-${entry.mood}`}>
                {entry.mood}
              </div>

              <p>{entry.text}</p>

              <div className="analysis-box">
                <p className="analysis-title">
                  Transparent Mood Analysis
                </p>

                <p>
                  Mood score: <strong>{entry.score}</strong>
                </p>

                <p>
                  This result was generated using sentiment analysis based on emotionally weighted words detected in your journal entry.
                </p>

                <div>
                  <strong>Detected keywords:</strong>

                  <div>
                    {entry.keywords && entry.keywords.length > 0 ? (
                      entry.keywords.map((word, index) => (
                        <span className="keyword" key={index}>
                          {word}
                        </span>
                      ))
                    ) : (
                      <p>No significant keywords detected.</p>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={() => handleDeleteEntry(entry._id)}>
                Delete Entry
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
