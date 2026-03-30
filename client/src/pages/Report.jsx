import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, MapPin, UploadCloud, AlertTriangle, 
  CheckCircle, Loader2, File, X, Lock, ExternalLink 
} from 'lucide-react';

const incidentTypes = [
  "Harassment", "Theft / Robbery", "Accident", 
  "Suspicious Activity", "Infrastructure Hazard", "Other"
];

const Report = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: null // { lat, lng }
  });
  
  const [evidence, setEvidence] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Submission States: 'idle', 'submitting', 'success'
  const [status, setStatus] = useState('idle');
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState(null); // Will hold { reportId, txHash }
  const fileInputRef = useRef(null);

  // --- Handlers ---
  
  const handleLocationCapture = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          }
        });
      },
      (error) => {
        alert("Unable to retrieve your location. Please check permissions.");
      }
    );
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setEvidence(e.dataTransfer.files[0]);
    }
  }, []);

  // Simulated Submission with Visual Progress Steps
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      alert("Please fill in the required fields (Type and Description).");
      return;
    }
    setStatus('submitting');

    // start progress
    setProgressStep(1); // Uploading to server

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('description', formData.description);
      if (formData.location) data.append('location', JSON.stringify(formData.location));
      if (evidence) data.append('evidence', evidence);

  // Normalize API base: remove trailing '/api' or trailing slash if present
  const rawApiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const apiBase = rawApiBase.replace(/\/api\/?$/, '').replace(/\/$/, '')

      console.log('Submitting to API base:', apiBase)
      const res = await fetch(`${apiBase}/api/complaints/report`, {
        method: 'POST',
        body: data
      });

      // Robust response parsing: handle HTML/text 404 pages as well as JSON
      const contentType = res.headers.get('content-type') || ''
      let json = null
      if (contentType.includes('application/json')) {
        json = await res.json()
      } else {
        const text = await res.text()
        // If server returned non-JSON (like an HTML 404), throw a readable error
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${text.substring(0, 200)}`)
        }
        try {
          json = JSON.parse(text)
        } catch (e) {
          json = { message: text }
        }
      }

      if (!res.ok) {
        throw new Error(json.error || json.message || 'Server error')
      }

      // Assume server handled pin & anchor (if present) and returned result
      setProgressStep(3);
      setResult({ reportId: json.reportId, txHash: json.txHash || null, cid: json.cid || null });
      setStatus('success');
    } catch (err) {
      console.error('Submission error', err);
      alert('Submission failed: ' + (err.message || err));
      setStatus('idle');
      setProgressStep(0);
    }
  };

  // --- Render Helpers ---

  const renderProgress = () => {
    const steps = ["Encrypting Data", "Pinning to IPFS", "Anchoring on Polygon"];
    return (
      <div className="space-y-6 py-8">
        <div className="flex justify-center mb-8">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
        </div>
        <div className="space-y-4 max-w-sm mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${progressStep > idx ? 'bg-emerald-500 border-emerald-500 text-white' : 
                  progressStep === idx + 1 ? 'border-purple-500 text-purple-500' : 'border-slate-700 text-slate-600'}`}>
                {progressStep > idx ? <CheckCircle className="w-5 h-5" /> : (idx + 1)}
              </div>
              <span className={`font-medium ${progressStep >= idx + 1 ? 'text-white' : 'text-slate-500'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium mb-2">
          <Lock className="w-4 h-4" /> Zero PII · 100% Anonymous
        </div>
        <h1 className="text-4xl font-bold text-white">File Anonymous Report</h1>
        <p className="text-slate-400">Your identity is protected. Evidence is permanently secured on the blockchain.</p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-8"
          >
            
            {/* Incident Type Grid */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">Incident Type <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {incidentTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.type === type 
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Location Capture */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">Exact Location</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleLocationCapture}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-medium transition-colors border border-slate-700 flex-1"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Capture GPS Location
                </button>
                {formData.location && (
                  <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex-1 justify-center">
                    <CheckCircle className="w-5 h-5" />
                    {formData.location.lat}, {formData.location.lng}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">Description <span className="text-red-400">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about the incident..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all min-h-[120px] resize-y"
              />
            </div>

            {/* Drag & Drop Evidence */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 flex justify-between">
                <span>Upload Evidence (Optional)</span>
                <span className="text-slate-500 font-normal">Photos, Audio, Logs</span>
              </label>
              
              {!evidence ? (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
                  }`}
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Drag and drop file here</p>
                  <p className="text-sm text-slate-500">or click to browse from your device</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && setEvidence(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <File className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs">{evidence.name}</p>
                      <p className="text-xs text-slate-400">{(evidence.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setEvidence(null)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Warning & Submit */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-2 text-xs text-slate-400 max-w-sm">
                <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p>By submitting, you agree to anchor this evidence immutably to the Polygon blockchain.</p>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
              >
                Secure & Submit Report
              </button>
            </div>
          </motion.form>
        )}

        {status === 'submitting' && (
          <motion.div 
            key="submitting"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Securing Evidence...</h2>
            <p className="text-slate-400">Please do not close this tab.</p>
            {renderProgress()}
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 p-8 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Report Secured!</h2>
              <p className="text-slate-400">Your evidence has been immutably anchored to the blockchain.</p>
            </div>
            
            <div className="bg-slate-950/50 rounded-2xl p-6 text-left space-y-4 border border-slate-800 max-w-md mx-auto">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Your Tracking ID</p>
                <div className="text-2xl font-mono font-bold text-purple-400 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 text-center">
                  {result?.reportId}
                </div>
                <p className="text-xs text-red-400 mt-2 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Save this ID. It cannot be recovered.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Polygon Transaction</p>
                <a 
                  href={`https://mumbai.polygonscan.com/tx/${result?.txHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-mono text-slate-300 transition-colors"
                >
                  <span className="truncate">{result?.txHash}</span>
                  <ExternalLink className="w-4 h-4 ml-2 shrink-0 text-blue-400" />
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => {
                  setStatus('idle');
                  setFormData({ type: '', description: '', location: null });
                  setEvidence(null);
                  setProgressStep(0);
                }}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                File another report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Report;