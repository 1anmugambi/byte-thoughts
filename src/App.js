import './App.css';
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';

function App() {
  const [note, setNote] = useState('');
  const [currentNotes, setCurrentNotes] = useState([]);
  const [noteType, setNoteType] = useState('General');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const codingJokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "There are 10 types of people in the world: those who understand binary and those who don’t.",
    "Why did the programmer quit his job? He didn’t get arrays.",
    "Why don't programmers like nature? It has too many bugs.",
    "Why do Java developers wear glasses? Because they can't C#.",
    "How many programmers does it take to change a lightbulb? None, that's a hardware problem!",
    "I told my computer I needed a break, and now it won’t stop sending me Kit-Kats.",
    "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
    "What’s a programmer’s favorite hangout place? The Foo Bar!",
    "Why was the JavaScript developer sad? Because he didn’t know how to 'null' his feelings.",
    "A programmer’s life is a loop: one bug, two bugs, three bugs, four bugs...",
    "To understand what recursion is, you must first understand recursion.",
    "What did the C++ programmer say to the JavaScript developer? 'I’ll see you in the stack, my friend!'",
    "There are 2 hard things in computer science: cache invalidation, naming things, and off-by-1 errors.",
    "I would tell you a joke about UDP, but you probably didn’t get it.",
    "What’s the object-oriented way to become wealthy? Inheritance."
  ];

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const handleClick = () => {
    if (note.trim()) {
      setCurrentNotes([...currentNotes, { text: note, type: noteType, done: false }]);
      setNote('');
    } else {
      alert("Bytes cannot be empty!");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') handleClick();
  };

  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(currentNotes, null, 2)], { type: 'application/json' });
    saveAs(blob, 'notes.json');
  };

  const importNotes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedNotes = JSON.parse(e.target.result);
          if (Array.isArray(parsedNotes)) {
            setCurrentNotes([...currentNotes, ...parsedNotes]);
          } else {
            alert("Invalid JSON file format. Please ensure it matches the exported format.");
          }
        } catch (error) {
          alert("Error parsing JSON file: " + error.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert("No file selected.");
    }
  };

  const markAsDone = (index) => {
    const updatedNotes = [...currentNotes];
    updatedNotes[index].done = !updatedNotes[index].done;
    setCurrentNotes(updatedNotes);
  };

  const filteredNotes = currentNotes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  return (
    <div className="App">
      <header>
        <h1>Byte Thoughts</h1>
        <div className="header-actions">
          <button className="btn btn-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="btn btn-export" onClick={exportNotes}>
            Export Notes
          </button>
          <label className="btn btn-import">
            Import Notes
            <input type="file" accept=".json" onChange={importNotes} hidden />
          </label>
          <input
            type="text"
            className="search-bar"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main>
        <div className="form-holder">
          <textarea
            className="note-input"
            placeholder="Write your bytes in Markdown..."
            onChange={handleChange}
            value={note}
            onKeyPress={handleKeyPress}
          />
          <select
            className="note-type"
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Bug">Bug</option>
            <option value="Feature Idea">Feature Idea</option>
            <option value="Comment">Comment</option>
          </select>
          <button className="btn btn-add" onClick={handleClick}>
            Add Note
          </button>
        </div>

        <section>
          <h2>Notes</h2>
          {filteredNotes.length === 0 ? (
            <p>{codingJokes[Math.floor(Math.random() * codingJokes.length)]}</p>
          ) : (
            <table className="notes-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note, index) => (
                  <tr key={index}>
                    <td>{note.type}</td>
                    <td>
                      <ReactMarkdown>{note.text}</ReactMarkdown>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={note.done}
                        onChange={() => markAsDone(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
