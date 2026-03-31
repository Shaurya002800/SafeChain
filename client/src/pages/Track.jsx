import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldCheck, Clock, FileText, 
  ExternalLink, Download, CheckCircle, AlertCircle, FileDigit 
} from 'lucide-react';

// Mock timeline steps
const TIMELINE_STEPS = [
  { id: 1, title: 'Report Submitted', desc: 'Encrypted data received by SafeChain network.', icon: <FileText className="w-5 h-5" /> },
  { id: 2, title: 'Evidence Pinned to IPFS', desc: 'Files decentralized and cryptographic CID generated.', icon: <FileDigit className="w-5 h-5" /> },
  { id: 3, title: 'Anchored on Polygon', desc: 'Keccak256 hash permanently secured on immutable ledger.', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 4, title: 'Under Review', desc: 'Local authorities or community moderators are reviewing.', icon: <Clock className="w-5 h-5" /> }
];

const Track = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setError('');
    setIsSearching(true);
    setReportData(null);

    (async () => {
      try {
        const id = searchInput.trim();
        if (id.length < 5) {
          setError('Invalid Report ID. Please check and try again.');
          setIsSearching(false);
          return;
        }

  // Normalize API base so client env can be either with or without trailing '/api'
  const rawApiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const apiBase = rawApiBase.replace(/\/api\/?$/, '').replace(/\/$/, '')
  const res = await fetch(`${apiBase}/api/complaints/status/${encodeURIComponent(id)}`);

        if (res.status === 404) {
          setError('Report not found');
          setIsSearching(false);
          return;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.error || 'Failed to lookup report');
          setIsSearching(false);
          return;
        }

        const doc = await res.json();

        // Map Firestore doc fields to client UI shape
        setReportData({
          id: doc.reportId || id,
          type: doc.type || 'Incident',
          date: doc.createdAt ? new Date(doc.createdAt._seconds ? doc.createdAt._seconds * 1000 : doc.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          location: doc.location || 'Unknown',
          statusLevel: doc.status === 'submitted' ? 2 : 1,
          ipfsCid: doc.cid || '—',
          txHash: doc.txHash || null
        });

        setIsSearching(false);
      } catch (err) {
        console.error('Lookup error', err);
        setError('Lookup failed — check server logs');
        setIsSearching(false);
      }
    })();
  };

  const handleDownloadPDF = () => {
    // In a real app, this would trigger a backend PDF generation endpoint
    alert("Generating cryptographically signed Legal PDF... (Mock for Hackathon)");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header & Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-12"
      >
        <h1 className="text-4xl font-bold text-white">Track Your Report</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Enter your anonymous Report ID to view the live status, verify blockchain anchoring, and download legal evidence.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:bg-purple-500/30 transition-colors duration-300"></div>
          <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl overflow-hidden focus-within:border-purple-500 transition-colors">
            <Search className="w-6 h-6 text-slate-400 ml-3" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g., REP-X9B2K"
              className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-slate-500 font-mono text-lg uppercase"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? <span className="animate-pulse">Locating...</span> : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 flex items-center justify-center gap-2 mt-4">
            <AlertCircle className="w-5 h-5" /> {error}
          </motion.p>
        )}
      </motion.div>

      {/* Results Dashboard */}
      <AnimatePresence>
        {reportData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Details & Blockchain Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Incident Meta */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Incident Record</h2>
                    <p className="font-mono text-purple-400 bg-purple-500/10 inline-block px-3 py-1 rounded-lg border border-purple-500/20">
                      {reportData.id}
                    </p>
                  </div>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Incident Type</p>
                    <p className="text-slate-200 font-medium">{reportData.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date Reported</p>
                    <p className="text-slate-200 font-medium">{reportData.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">GPS Anchor</p>
                    <p className="text-slate-200 font-medium">{reportData.location}</p>
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -top-4 w-32 h-32 text-emerald-500/5" />
                
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Immutable Verification
                </h3>
                
                <div className="space-y-5 relative z-10">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">IPFS Content Identifier (CID)</p>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="font-mono text-sm text-slate-400 truncate mr-4">{reportData.ipfsCid}</span>
                      <a href={`https://ipfs.io/ipfs/${reportData.ipfsCid}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Polygon Tx Hash</p>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="font-mono text-sm text-slate-400 truncate mr-4">{reportData.txHash || '—'}</span>
                      {reportData.txHash ? (
                        <a
                          href={`https://amoy.polygonscan.com/tx/${encodeURIComponent(reportData.txHash)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs font-medium uppercase tracking-wide"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 text-sm">Not anchored yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Status Timeline */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-8">Status Timeline</h3>
              
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-slate-700 before:to-slate-800">
                
                {TIMELINE_STEPS.map((step, index) => {
                  const isActive = reportData.statusLevel >= step.id;
                  const isCurrent = reportData.statusLevel === step.id;
                  
                  return (
                    <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Timeline Icon */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md
                        ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {isActive && !isCurrent ? <CheckCircle className="w-5 h-5" /> : step.icon}
                      </div>

                      {/* Content Card */}
                      <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'bg-purple-500/10 border-purple-500/30' 
                          : isActive 
                            ? 'bg-slate-800/50 border-slate-700/50' 
                            : 'bg-slate-900/30 border-slate-800/30 opacity-60'
                      }`}>
                        <div className="flex flex-col">
                          <h4 className={`font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.title}</h4>
                          <p className={`text-sm ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Track;