import { useState } from 'react';

const phases = [
  {
    num: 1, title: 'Before the Visit', subtitle: 'Prepare before leaving the office', color: 'blue',
    items: [
      { num: 1, title: 'Log in to Sales Portal', preview: 'Enter credentials', do: ['Enter your official email and password', 'Wait for the dashboard to fully load'] },
      { num: 2, title: 'Check dashboard stats', preview: 'Review key numbers', do: ['Review Total PGs, Rooms, Tenants and Active Tenants', 'Note any significant changes from yesterday'] },
      { num: 3, title: 'Review Unverified PGs', preview: 'Follow up on pending', do: ['Go to sidebar → Unverified PGs', 'Filter by your area', 'Call all pending owners to schedule or confirm visit'] },
    ],
  },
  {
    num: 2, title: 'At the PG', subtitle: 'What to do when you arrive at the property', color: 'emerald',
    items: [
      { num: 4, title: 'Introduce yourself', preview: 'Build rapport with owner', do: ['Greet the owner warmly by name if known', 'Show your company ID or business card', 'Briefly explain the ManageYourPG platform benefits', 'Walk through the property — count rooms personally'] },
      { num: 5, title: 'Collect PG details', preview: 'Gather all property info', do: ['PG Name and Type (Boys / Girls / Mixed)', 'Exact room count — verify physically', 'Full address with landmark', 'Monthly rent: single, double, triple rooms', 'Daily rent if they offer short-stay', 'List all amenities: WiFi, AC, meals, laundry, parking'] },
      { num: 6, title: 'Capture GPS location', preview: 'Must be done on-site', do: ['Open the app while physically standing at the property entrance', 'Tap "Get Live Location" — do NOT do this from home or office', 'Verify the pin drops at the correct building', 'GPS accuracy is critical for tenant navigation — do not skip'] },
    ],
  },
  {
    num: 3, title: 'App Registration', subtitle: 'Complete all screens in sequence — do not skip any', color: 'violet',
    items: [
      { num: 7, title: 'Open Add PG Owner', preview: 'Start registration', do: ['Tap Menu in the top-left sidebar', 'Select "Add PG Owner"'] },
      { num: 8, title: 'Fill owner information', preview: 'Full Name, Phone, Email', do: ['Full legal name of the PG owner', 'Mobile number (WhatsApp preferred)', 'Email address — create Gmail on the spot if needed', 'Create a secure password and write it down for the owner'] },
      { num: 9, title: 'Set location details', preview: 'Live GPS or manual entry', do: ['Tap "Get Live Location" while standing at the property', 'If GPS fails: stand outside the building, toggle mobile data', 'Enter number of PGs owned by this person in the dropdown'] },
      { num: 10, title: 'PG property details', preview: 'Name, type, rooms', do: ['PG Name as the owner uses it', 'PG Type: Boys / Girls / Mixed', 'Total number of rooms — must match your physical count', 'Full address with area, city, and pincode'] },
      { num: 11, title: 'Enter pricing', preview: 'Monthly and daily rates', do: ['Monthly rent: single room, double sharing, triple sharing', 'Daily rent if applicable (leave blank if not offered)', 'Pricing must match what the owner confirmed verbally'] },
      { num: 12, title: 'Upload photo and submit', preview: 'Final step — create account', do: ['Take a clear front-facing photo of the property entrance', 'Select all applicable amenities from the checklist', 'Tap "Get PG Location" one final time to confirm pin', 'Review all details — then tap "Create PG Owner Account"', 'Confirm the owner receives their login SMS or email'] },
    ],
  },
  {
    num: 4, title: 'After the Visit', subtitle: 'Complete all end-of-day tasks before 7 PM', color: 'amber',
    items: [
      { num: 13, title: 'Share the QR code', preview: 'My PGs → Share QR', do: ['Go to My PGs in the sidebar', 'Find the newly approved PG (green badge)', 'Tap Share QR — send via WhatsApp to the owner', 'Also copy the listing link and share it'] },
      { num: 14, title: 'Submit Daily Activity', preview: 'Log all activity by 7 PM', do: ['Tap Daily Activity in the sidebar', 'Enter: Leads generated today', 'Enter: Total calls made', 'Enter: Visits completed', 'Enter: Meetings done, Conversions closed, Follow-ups planned', 'Add notes about any issues or observations', 'Tap "Submit Daily Activity" — must be done before 7 PM every day'] },
      { num: 15, title: 'Log out', preview: 'Secure your session', do: ['Tap your profile name at the bottom of the sidebar', 'Select Logout', 'Confirm — your data is saved automatically'] },
    ],
  },
  {
    num: 5, title: 'Quick Reference', subtitle: 'Common problems and what to avoid', color: 'cyan',
    items: [
      { num: 'Q1', title: 'Owner has no email address?', preview: 'Create Gmail on the spot', do: ['Ask owner to download Gmail on their phone right now', 'Help them create: firstname + phone number @gmail.com', 'Example: suresh9876@gmail.com', 'Note the credentials securely before leaving'] },
      { num: 'Q2', title: 'GPS is not working?', preview: '3 fallback steps', do: ['Step 1: Walk outside the building — GPS needs open sky', 'Step 2: Turn mobile data off and back on, wait 10 seconds', 'Step 3: Restart the app and try again', 'Last resort: enter the address manually — get it exactly right'] },
      { num: 'Q3', title: 'Owner wants to change pricing later?', preview: 'Owner portal or manager', do: ['Inform owner they can update pricing themselves in the Owner Portal', 'Or they can contact you and you raise a change request with your manager', 'Pricing changes take effect after manager approval'] },
      { num: 'Q4', title: 'How do I know the PG is approved?', preview: 'Check My PGs badge', do: ['Open My PGs in the sidebar', 'Look for the green "Approved" badge on the card', 'Only share the QR code and listing link after approval', 'Pending status means admin is still reviewing'] },
      { num: 'Q5', title: 'Owner has multiple PGs?', preview: 'Register each separately', do: ['Select the correct number of PGs in the dropdown during registration', 'Each PG must be registered separately with its own details', 'Do not combine room counts from different buildings'] },
      { num: '!', title: 'Critical mistakes to avoid', preview: 'Read before every visit', do: ['NEVER capture GPS location from home, office, or a vehicle', 'NEVER skip the property entrance photo — it is mandatory', 'NEVER guess room count — physically verify every room', 'NEVER leave without submitting Daily Activity', 'NEVER share a QR code before the PG shows Approved status'] },
    ],
  },
];

const phaseIcons: Record<number, string> = {
  1: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  2: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  3: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
  4: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  5: 'M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z',
};

const colorConfig: Record<string, {
  sidebar: string; sidebarNum: string; hero: string;
  numBg: string; numText: string;
  dotBg: string; dotFill: string;
  progressBar: string; navActive: string;
}> = {
  blue: {
    sidebar: 'bg-blue-800', sidebarNum: 'bg-blue-900 text-blue-200',
    hero: 'bg-blue-800',
    numBg: 'bg-blue-50', numText: 'text-blue-700',
    dotBg: 'bg-blue-50', dotFill: 'fill-blue-500',
    progressBar: 'bg-blue-500', navActive: 'bg-blue-900',
  },
  emerald: {
    sidebar: 'bg-emerald-800', sidebarNum: 'bg-emerald-900 text-emerald-200',
    hero: 'bg-emerald-800',
    numBg: 'bg-emerald-50', numText: 'text-emerald-700',
    dotBg: 'bg-emerald-50', dotFill: 'fill-emerald-500',
    progressBar: 'bg-emerald-500', navActive: 'bg-emerald-900',
  },
  violet: {
    sidebar: 'bg-violet-800', sidebarNum: 'bg-violet-900 text-violet-200',
    hero: 'bg-violet-800',
    numBg: 'bg-violet-50', numText: 'text-violet-700',
    dotBg: 'bg-violet-50', dotFill: 'fill-violet-500',
    progressBar: 'bg-violet-500', navActive: 'bg-violet-900',
  },
  amber: {
    sidebar: 'bg-amber-800', sidebarNum: 'bg-amber-900 text-amber-200',
    hero: 'bg-amber-800',
    numBg: 'bg-amber-50', numText: 'text-amber-700',
    dotBg: 'bg-amber-50', dotFill: 'fill-amber-500',
    progressBar: 'bg-amber-500', navActive: 'bg-amber-900',
  },
  cyan: {
    sidebar: 'bg-cyan-800', sidebarNum: 'bg-cyan-900 text-cyan-200',
    hero: 'bg-cyan-800',
    numBg: 'bg-cyan-50', numText: 'text-cyan-700',
    dotBg: 'bg-cyan-50', dotFill: 'fill-cyan-500',
    progressBar: 'bg-cyan-500', navActive: 'bg-cyan-900',
  },
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function StepCard({ item, isOpen, onToggle, color }: { item: any; isOpen: boolean; onToggle: () => void; color: string }) {
  const c = colorConfig[color] || colorConfig.blue;
  const isWarn = item.num === '!';
  const isQ = typeof item.num === 'string' && !isWarn;

  const numBg = isWarn ? 'bg-red-50' : isQ ? 'bg-slate-100' : c.numBg;
  const numText = isWarn ? 'text-red-600' : isQ ? 'text-slate-500' : c.numText;
  const dotBg = isWarn ? 'bg-red-50' : isQ ? 'bg-slate-100' : c.dotBg;
  const dotFill = isWarn ? 'fill-red-500' : isQ ? 'fill-slate-400' : c.dotFill;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200
      ${isOpen ? 'border-slate-200 shadow-lg shadow-slate-100' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md hover:shadow-slate-100'}`}>

      <button onClick={onToggle}
        className="w-full flex items-center gap-5 px-7 py-5 hover:bg-slate-50/60 transition-colors text-left"
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-bold ${numBg} ${numText}`}>
          {item.num}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-slate-900 leading-snug">{item.title}</p>
          {!isOpen && (
            <p className="text-sm text-slate-400 mt-0.5 truncate">{item.preview || item.do[0]}</p>
          )}
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-slate-200">
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-7 pb-6 pt-5">
          <div className="pl-[68px] flex flex-col gap-4">
            {item.do.map((task: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center ${dotBg}`}>
                  <svg viewBox="0 0 8 8" className={`w-2 h-2 ${dotFill}`}><circle cx="4" cy="4" r="4" /></svg>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{task}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FieldManual() {
  const [activePhase, setActivePhase] = useState(0);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (key: string) => setOpenSteps(p => ({ ...p, [key]: !p[key] }));
  const switchPhase = (i: number) => { setActivePhase(i); setOpenSteps({}); setSidebarOpen(false); };

  const phase = phases[activePhase];
  const c = colorConfig[phase.color] || colorConfig.blue;
  const openCount = phase.items.filter((_, idx) => openSteps[`${activePhase}-${idx}`]).length;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-7 pt-8 pb-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white tracking-tight">Field Manual</h1>
          <p className="text-slate-500 text-xs mt-1">ManageYourPG Sales Portal</p>
        </div>

        <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
          {phases.map((p, i) => (
            <button key={i} onClick={() => switchPhase(i)}
              className={`flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200
                ${i === activePhase ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
                ${i === activePhase ? c.sidebarNum : 'bg-slate-800 text-slate-500'}`}>
                {p.num}
              </div>
              <div>
                <p className={`text-sm font-medium transition-colors ${i === activePhase ? 'text-white' : 'text-slate-400'}`}>
                  {p.title}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{p.items.length} steps</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-slate-600">Sales Portal v1.0 — 2026</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 md:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">{phase.title}</span>
          <div className="w-9" />
        </div>

        {/* Mobile phase tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none bg-slate-900 border-t border-white/10 md:hidden">
          {phases.map((p, i) => (
            <button key={i} onClick={() => switchPhase(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all
                ${i === activePhase ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
              {p.title}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10 max-w-4xl mx-auto">

          {/* Phase hero */}
          <div className={`${c.hero} rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden`}>
            <div className="absolute right-8 top-4 text-[96px] font-black text-white/10 leading-none select-none">{phase.num}</div>
            <div className="relative flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="rgba(255,255,255,0.9)">
                  <path d={phaseIcons[phase.num]} />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">Phase {phase.num}</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">{phase.title}</h2>
                <p className="text-white/55 text-sm leading-relaxed max-w-lg">{phase.subtitle}</p>
                <div className="inline-flex items-center gap-2 mt-4 bg-white/10 rounded-full px-4 py-2">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white/60"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  <span className="text-xs text-white/60">{phase.items.length} steps in this phase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{openCount} of {phase.items.length} steps reviewed</span>
              <span className="text-xs font-medium text-slate-500">{Math.round(openCount / phase.items.length * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${c.progressBar}`}
                style={{ width: `${Math.round(openCount / phase.items.length * 100)}%` }} />
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {phase.items.map((item, idx) => {
              const key = `${activePhase}-${idx}`;
              return (
                <StepCard key={idx} item={item} isOpen={!!openSteps[key]}
                  onToggle={() => toggle(key)} color={phase.color} />
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-300 mt-10">
            Sales Portal Field Manual v1.0 — 2026
          </p>
        </div>
      </main>
    </div>
  );
}