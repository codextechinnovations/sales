import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const phases = [
  {
    num: 1,
    title: 'Before the Visit',
    subtitle: 'Prepare before leaving the office',
    color: 'blue',
    items: [
      { num: 1, title: 'Log in to Sales Portal', preview: 'Enter credentials', do: ['Enter your official email and password', 'Wait for the dashboard to fully load'] },
      { num: 2, title: 'Check dashboard stats', preview: 'Review key numbers', do: ['Review Total PGs, Rooms, Tenants and Active Tenants', 'Note any significant changes from yesterday'] },
      { num: 3, title: 'Review Unverified PGs', preview: 'Follow up on pending', do: ['Go to sidebar → Unverified PGs', 'Filter by your area', 'Call all pending owners to schedule or confirm visit'] },
    ],
  },
  {
    num: 2,
    title: 'At the PG',
    subtitle: 'What to do when you arrive at the property',
    color: 'emerald',
    items: [
      { num: 4, title: 'Introduce yourself', preview: 'Build rapport with owner', do: ['Greet the owner warmly by name if known', 'Show your company ID or business card', 'Briefly explain the ManageYourPG platform benefits', 'Walk through the property — count rooms personally'] },
      { num: 5, title: 'Collect PG details', preview: 'Gather all property info', do: ['PG Name and Type (Boys / girls / mixed)', 'Exact room count — verify physically', 'Full address with landmark', 'Monthly rent: single, double, triple rooms', 'Daily rent if they offer short-stay', 'List all amenities: WiFi, AC, meals, laundry, parking'] },
      { num: 6, title: 'Capture GPS location', preview: 'Must be done on-site', do: ['Open the app while physically standing at the property entrance', 'Tap "Get Live Location" — do NOT do this from home or office', 'Verify the pin drops at the correct building', 'GPS accuracy is critical for tenant navigation — do not skip'] },
    ],
  },
  {
    num: 3,
    title: 'App Registration',
    subtitle: 'Complete all screens in sequence',
    color: 'violet',
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
    num: 4,
    title: 'After the Visit',
    subtitle: 'Complete all end-of-day tasks',
    color: 'amber',
    items: [
      { num: 13, title: 'Share the QR code', preview: 'My PGs → Share QR', do: ['Go to My PGs in the sidebar', 'Find the newly approved PG (green badge)', 'Tap Share QR — send via WhatsApp to the owner', 'Also copy the listing link and share it'] },
      { num: 14, title: 'Submit Daily Activity', preview: 'Log all activity by 7 PM', do: ['Tap Daily Activity in the sidebar', 'Enter: Leads generated today', 'Enter: Total calls made', 'Enter: Visits completed', 'Enter: Meetings done, Conversions closed, Follow-ups planned', 'Add notes about any issues or observations', 'Tap "Submit Daily Activity" — must be done before 7 PM every day'] },
      { num: 15, title: 'Log out', preview: 'Secure your session', do: ['Tap your profile name at the bottom of the sidebar', 'Select Logout', 'Confirm — your data is saved automatically'] },
    ],
  },
  {
    num: 5,
    title: 'Quick Reference',
    subtitle: 'Common problems and what to avoid',
    color: 'cyan',
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

const colorConfig: Record<string, any> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-500', hero: 'bg-blue-600', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-l-emerald-500', hero: 'bg-emerald-600', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-l-violet-500', hero: 'bg-violet-600', badgeBg: 'bg-violet-100', badgeText: 'text-violet-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500', hero: 'bg-amber-600', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-l-cyan-500', hero: 'bg-cyan-600', badgeBg: 'bg-cyan-100', badgeText: 'text-cyan-700' },
};

function StepCard({ item, isOpen, onToggle, colors }: { item: any; isOpen: boolean; onToggle: () => void; colors: any }) {
  const isWarning = item.num === '!';
  const isQ = typeof item.num === 'string' && !isWarning;
  const badgeBg = isWarning ? 'bg-red-100' : isQ ? 'bg-slate-100' : colors.badgeBg;
  const badgeText = isWarning ? 'text-red-600' : isQ ? 'text-slate-500' : colors.badgeText;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${isOpen ? 'shadow-lg' : ''}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${badgeBg} ${badgeText}`}>
          {item.num}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{item.title}</p>
          {!isOpen && <p className="text-sm text-slate-400 truncate">{item.preview || item.do[0]}</p>}
        </div>
        {isOpen ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
          <ul className="space-y-2">
            {item.do.map((task: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function FieldManual() {
  const [activePhase, setActivePhase] = useState(0);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setOpenSteps(p => ({ ...p, [key]: !p[key] }));
  const switchPhase = (i: number) => { setActivePhase(i); setOpenSteps({}); };

  const phase = phases[activePhase];
  const colors = colorConfig[phase.color] || colorConfig.blue;
  const openCount = phase.items.filter((_, idx) => openSteps[`${activePhase}-${idx}`]).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-6">
      <div className="flex flex-wrap gap-2">
        {phases.map((p, i) => (
          <button key={i} onClick={() => switchPhase(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              i === activePhase ? `${colors.hero} text-white` : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              i === activePhase ? 'bg-white/20' : 'bg-slate-200'
            }`}>
              {p.num}
            </span>
            {p.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700">{phase.num}</div>
        <div>
          <div className="text-sm font-semibold text-slate-800">{phase.title}</div>
          <div className="text-xs text-slate-500">{phase.subtitle}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{openCount} of {phase.items.length} steps viewed</span>
          <span className="text-sm font-medium text-slate-600">{Math.round(openCount / phase.items.length * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${colors.hero}`} style={{ width: `${Math.round((openCount / phase.items.length) * 100)}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {phase.items.map((item, idx) => {
          const key = `${activePhase}-${idx}`;
          return (
            <StepCard key={idx} item={item} isOpen={!!openSteps[key]}
              onToggle={() => toggle(key)} colors={colors} />
          );
        })}
      </div>

      <div className="text-center py-6 text-slate-400 text-sm">
        <p>Sales Portal Field Manual v1.0 — 2026</p>
      </div>
    </div>
  );
}
