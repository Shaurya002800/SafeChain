import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🔒',
    title: 'Anonymous reporting',
    desc: 'No account, no email, no identity. File a report in under 2 minutes with zero personal data collected.',
    color: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: '⛓️',
    title: 'Blockchain evidence',
    desc: 'Your screenshots and call logs are hashed on Polygon — immutable, tamper-proof, and legally verifiable.',
    color: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: '🗺️',
    title: 'Real-time safety map',
    desc: 'Crowd-sourced safety scores for every route and stop, updated live as new incidents are reported.',
    color: 'bg-green-500/10 border-green-500/20',
  },
]

const steps = [
  {
    num: '1',
    color: 'bg-purple-500/20 text-purple-400',
    title: 'You upload evidence',
    desc: 'Screenshot, audio recording, or call log — anything that proves what happened.',
  },
  {
    num: '2',
    color: 'bg-blue-500/20 text-blue-400',
    title: 'Stored on IPFS',
    desc: 'Files go to IPFS — a decentralized network no single person or company controls.',
  },
  {
    num: '3',
    color: 'bg-amber-500/20 text-amber-400',
    title: 'Hash anchored on blockchain',
    desc: 'A cryptographic fingerprint of your file is permanently written to the Polygon blockchain.',
  },
  {
    num: '4',
    color: 'bg-green-500/20 text-green-400',
    title: 'Legally verifiable forever',
    desc: 'Anyone can verify your evidence was not altered — on-chain, publicly, permanently.',
  },
]

const stats = [
  { num: '247', label: 'Reports filed' },
  { num: '100%', label: 'Anonymous' },
  { num: '0', label: 'Evidence tampered' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
          Blockchain-secured · Anonymous · Real-time
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Safety you can{' '}
          <span className="text-purple-400">trust.</span>
          <br />
          Evidence that{' '}
          <span className="text-emerald-400">can't be erased.</span>
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Report incidents anonymously. Secure your evidence on the blockchain.
          Navigate cities using real-time crowd-sourced safety scores.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/report"
            className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-xl transition-colors duration-150"
          >
            ⚡ File a Report
          </Link>
          <Link
            to="/map"
            className="px-8 py-3.5 bg-transparent hover:bg-white/5 text-gray-300 font-semibold text-base rounded-xl border border-white/10 transition-colors duration-150"
          >
            View Safety Map →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-purple-500/7 border border-purple-500/15 rounded-2xl py-5 px-4"
            >
              <p className="text-3xl font-extrabold text-purple-400">{s.num}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-bold text-purple-500 tracking-widest uppercase mb-3">
          What we do
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
          Two problems. One platform.
        </h2>
        <p className="text-gray-500 mb-10">
          Built for those who need to be heard — and believed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 hover:border-purple-500/40 rounded-2xl p-6 transition-colors duration-200"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl mb-5 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How blockchain works ── */}
      <section className="bg-gray-900/40 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold text-purple-500 tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-10">
            How we make evidence tamper-proof
          </h2>

          <div className="flex flex-col divide-y divide-gray-800">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5 items-start py-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 mt-0.5 ${s.color}`}>
                  {s.num}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-purple-600/15 to-indigo-600/10 border border-purple-500/25 rounded-3xl px-8 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Your safety matters.
            <br />
            Your evidence should too.
          </h2>
          <p className="text-gray-400 mb-8 text-base">
            Join hundreds who've already secured their reports on the blockchain.
          </p>
          <Link
            to="/report"
            className="inline-block px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-xl transition-colors duration-150"
          >
            File an anonymous report →
          </Link>
        </div>
      </section>

    </div>
  )
}