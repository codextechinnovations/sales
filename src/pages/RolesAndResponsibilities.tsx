import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { post } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function RolesAndResponsibilities() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [accepted, setAccepted] = useState(user?.rolesAccepted || false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user?.rolesAccepted) {
      setAccepted(true);
    }
  }, [user]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await post('/salesperson/accept-roles', {});
      setAccepted(true);
      setShowConfirm(false);
      await refreshUser();
    } catch (error) {
      console.error('Error accepting roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {!accepted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-yellow-800 font-medium">Action Required</p>
            <p className="text-yellow-700 text-sm">Please read and accept the Roles & Responsibilities to continue.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-700 to-cyan-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">ROLES AND RESPONSIBILITIES</h1>
          <p className="text-cyan-100 mt-1">PG Management App Sales Executive</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
              <p className="font-medium text-gray-900">Sales & Business Development</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Reports To</p>
              <p className="font-medium text-gray-900">Sales Manager</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Employment Type</p>
              <p className="font-medium text-gray-900">Full-time / Commission-based</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Position Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              The PG Management App Sales Executive is responsible for identifying, approaching, and onboarding 
              Paying Guest (PG) accommodation owners to our comprehensive PG management platform. This role 
              combines lead generation, consultative selling, fee collection, technical setup, and customer 
              training to ensure successful implementation and user adoption.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Key Responsibilities</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">1. Lead Generation & Prospecting</h3>
                <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                  <li>Search and identify PG accommodations through online platforms, directories, and social media</li>
                  <li>Conduct cold calling campaigns to reach out to potential PG owners</li>
                  <li>Perform field visits to PG locations to establish face-to-face connections</li>
                  <li>Build and maintain a database of prospects and track all interactions</li>
                  <li>Research each prospect to understand their business needs and pain points</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">2. Sales & Client Engagement</h3>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
                  <li>Approach PG owners with a professional and consultative sales approach</li>
                  <li>Present and demonstrate the PG management app features and functionalities</li>
                  <li>Clearly articulate the benefits and ROI of implementing the app</li>
                  <li>Address questions, concerns, and objections effectively</li>
                  <li>Negotiate terms and close sales deals</li>
                  <li>Collect subscription/setup fees as per company pricing structure</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">3. Implementation & Technical Setup</h3>
                <ul className="list-disc list-inside text-purple-800 text-sm space-y-1">
                  <li>Install and configure the PG management app on client devices</li>
                  <li>Set up the customized website for the PG property</li>
                  <li>Add and configure all room details (types, amenities, pricing, availability)</li>
                  <li>Upload property photos and relevant documentation</li>
                  <li>Configure payment gateways, booking systems, and notification settings</li>
                  <li>Ensure all technical aspects are functioning correctly before handover</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">4. Training & Customer Onboarding</h3>
                <ul className="list-disc list-inside text-orange-800 text-sm space-y-1">
                  <li>Provide comprehensive training to PG owners on app usage</li>
                  <li>Explain how to manage bookings, tenant details, and payments</li>
                  <li>Demonstrate reporting features and analytics dashboard</li>
                  <li>Train on how to update room availability and pricing</li>
                  <li>Share user guides, video tutorials, and support resources</li>
                  <li>Ensure the owner is confident and comfortable using the platform</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">5. Documentation & Reporting</h3>
                <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                  <li>Maintain accurate records of all leads, meetings, and follow-ups</li>
                  <li>Document sales activities and outcomes in CRM system</li>
                  <li>Submit weekly sales reports and pipeline updates</li>
                  <li>Report on conversion rates, challenges, and market feedback</li>
                  <li>Track and report on customer satisfaction post-implementation</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Key Performance Indicators (KPIs)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Number of leads generated per week/month',
                'Number of field visits and client meetings conducted',
                'Conversion rate (leads to successful installations)',
                'Number of successful app installations and setups per month',
                'Customer satisfaction score post-implementation',
                'Revenue generated from fees collected',
                'Average time to complete full setup and training per client'
              ].map((kpi, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-sm">{kpi}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Compensation Structure</h2>
            <p className="text-2xl font-bold text-cyan-700 mb-4">Commission per Conversion: ₹1,000 per successfully converted lead</p>
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-semibold text-gray-900 mb-2">Definition of Conversion:</p>
              <p className="text-gray-600 text-sm">A lead is considered converted when all the following are completed:</p>
              <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                <li>Fees have been collected from the PG owner</li>
                <li>App and website setup is complete</li>
                <li>All rooms are added to the system</li>
                <li>Training has been provided and owner can independently use the app</li>
                <li>Customer has signed off on the implementation</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Required Skills & Qualifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-cyan-700 mb-2">Essential Skills:</p>
                <ul className="space-y-2">
                  {[
                    'Excellent communication and interpersonal skills',
                    'Strong sales and negotiation abilities',
                    'Self-motivated with ability to work independently',
                    'Basic technical aptitude to handle app installation and setup',
                    'Good organizational and time management skills',
                    'Ability to conduct effective product demonstrations',
                    'Customer service orientation and patience for training',
                    'Proficiency in local language and English'
                  ].map((skill, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-cyan-700 mb-2">Preferred Qualifications:</p>
                <ul className="space-y-2">
                  {[
                    'Previous experience in B2B sales or field sales',
                    'Familiarity with real estate, property management, or hospitality sector',
                    'Experience with SaaS or technology product sales',
                    'Valid driving license and own vehicle (for field visits)',
                    'Knowledge of the local PG market and geography'
                  ].map((qual, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="text-blue-500 flex-shrink-0" size={16} />
                      {qual}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Work Environment</h2>
            <p className="text-gray-600 leading-relaxed">
              This is a field-based role requiring regular travel to meet clients at their PG properties. 
              The position involves a mix of office work (for online research and cold calling) and field visits. 
              Flexibility in working hours may be required to accommodate client schedules.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">Success Profile</h2>
            <p className="text-gray-300 leading-relaxed">
              The ideal candidate is a hustler with strong interpersonal skills who can build trust quickly 
              with PG owners. They are comfortable with rejection in cold calling, enjoy field work, can explain 
              technology concepts simply, and are patient in training others. They take pride in seeing clients 
              successfully adopt and benefit from the platform.
            </p>
          </div>

          {accepted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-green-800">Roles & Responsibilities Accepted</p>
                <p className="text-green-700 text-sm">You have accepted the terms and can proceed with your duties.</p>
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Accept Roles & Responsibilities
                </button>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-700 font-medium mb-4">Are you sure you want to accept these Roles & Responsibilities?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAccept}
                      disabled={loading}
                      className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                      Yes, I Accept
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}