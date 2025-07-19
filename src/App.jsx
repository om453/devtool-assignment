import { useState } from 'react';
import { useRef } from 'react';
import React from 'react';

const TABS = [
  { label: 'JSON Formatter', value: 'json' },
  { label: 'Base64 Encoder/Decoder', value: 'base64' },
  { label: 'JSON History', value: 'history' },
];

function App() {
  const [activeTab, setActiveTab] = useState('json');
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors">
      <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-purple-300 mb-0 tracking-tight drop-shadow">Dev Toolbox</h1>
          <button
            className="ml-4 px-4 py-2 rounded-lg font-semibold shadow border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:ring-2 focus:ring-blue-400"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <div className="flex justify-center mb-8 gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 ${
                activeTab === tab.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white border-blue-600 scale-105'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full">
          {activeTab === 'json' && <JsonFormatter />}
          {activeTab === 'base64' && <Base64Tool />}
          {activeTab === 'history' && <JsonHistory />}
        </div>
      </div>
    </div>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    setError('');
    setOutput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/format-Json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: input }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.formatted);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (e) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="json-input" className="block font-semibold mb-1 text-gray-700">Raw JSON Input</label>
      <textarea
        id="json-input"
        aria-label="Raw JSON Input"
        className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none shadow-inner"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type JSON here..."
      />
      <button
        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-600 transition focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        onClick={handleFormat}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Formatting...' : 'Format JSON'}
      </button>
      {error && <div className="text-red-600 font-medium" role="alert">{error}</div>}
      {output && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <label htmlFor="json-output" className="block font-semibold mb-1 text-gray-700">Formatted JSON</label>
          <div className="relative">
            <pre
              id="json-output"
              ref={outputRef}
              className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto mb-2"
              tabIndex={0}
              aria-label="Formatted JSON Output"
            >
              {output}
            </pre>
            <button
              className="absolute top-2 right-2 bg-blue-100 px-2 py-1 rounded text-xs text-blue-700 font-semibold hover:bg-blue-200 focus:ring-2 focus:ring-blue-400"
              onClick={handleCopy}
              aria-label="Copy formatted JSON"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Base64Tool() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    setError('');
    setOutput('');
    setLoading(true);
    try {
      const endpoint = mode === 'encode' ? 'encode' : 'decode';
      const body = mode === 'encode' ? { text: input } : { base64: input };
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (e) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 ${
            mode === 'encode'
              ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white border-blue-600 scale-105'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'
          }`}
          onClick={() => {
            setMode('encode');
            setInput('');
            setOutput('');
            setError('');
          }}
          aria-pressed={mode === 'encode'}
        >
          Encode
        </button>
        <button
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 ${
            mode === 'decode'
              ? 'bg-gradient-to-r from-blue-600 to-purple-500 text-white border-blue-600 scale-105'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700'
          }`}
          onClick={() => {
            setMode('decode');
            setInput('');
            setOutput('');
            setError('');
          }}
          aria-pressed={mode === 'decode'}
        >
          Decode
        </button>
      </div>
      <label htmlFor="base64-input" className="block font-semibold mb-1 text-gray-700">
        {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
      </label>
      <textarea
        id="base64-input"
        aria-label={mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
        className="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none shadow-inner"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
      />
      <button
        className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-600 transition focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
        onClick={handleProcess}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? (mode === 'encode' ? 'Encoding...' : 'Decoding...') : mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
      {error && <div className="text-red-600 font-medium" role="alert">{error}</div>}
      {output && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <label htmlFor="base64-output" className="block font-semibold mb-1 text-gray-700">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <div className="relative">
            <pre
              id="base64-output"
              ref={outputRef}
              className="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto mb-2"
              tabIndex={0}
              aria-label={mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            >
              {output}
            </pre>
            <button
              className="absolute top-2 right-2 bg-blue-100 px-2 py-1 rounded text-xs text-blue-700 font-semibold hover:bg-blue-200 focus:ring-2 focus:ring-blue-400"
              onClick={handleCopy}
              aria-label="Copy output"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function JsonHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState({});

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/json-history');
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Failed to fetch history');
      }
    } catch (e) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleCopy = (text, id, type) => {
    navigator.clipboard.writeText(text);
    setCopiedId((prev) => ({ ...prev, [id + '-' + type]: true }));
    setTimeout(() => setCopiedId((prev) => ({ ...prev, [id + '-' + type]: false })), 1200);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-purple-300 mb-2 text-center">JSON History</h2>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-red-600 font-medium mb-2 text-center" role="alert">{error}</div>}
      {!loading && !error && history.length === 0 && <div className="text-center text-gray-500">No JSONs have been processed yet.</div>}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm">
              <div className="text-xs text-gray-500 mb-1 text-right">{new Date(item.created_at).toLocaleString()}</div>
              <div className="mb-2 relative">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Original:</span>
                <pre className="bg-gray-200 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto mt-1 font-mono mb-1">{item.original}</pre>
                <button
                  className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-400"
                  onClick={() => handleCopy(item.original, item.id, 'original')}
                  aria-label="Copy original JSON"
                >
                  {copiedId[item.id + '-original'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="relative">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Formatted:</span>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto mt-1 font-mono mb-1">{item.formatted}</pre>
                <button
                  className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-400"
                  onClick={() => handleCopy(item.formatted, item.id, 'formatted')}
                  aria-label="Copy formatted JSON"
                >
                  {copiedId[item.id + '-formatted'] ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
