import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, Target, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useCompanies } from '../hooks/useCompanies';
import { TOP_COMPANIES, ONBOARDING_STEPS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompanyToggle = (company) => {
    setSelectedCompanies(prev =>
      prev.find(c => c.slug === company.slug)
        ? prev.filter(c => c.slug !== company.slug)
        : [...prev, company]
    );
  };

  const handleNext = async () => {
    if (currentStep === 2 && selectedCompanies.length < 3) {
      toast.error('Please select at least 3 companies');
      return;
    }

    if (currentStep === 3) {
      if (!cgpa || parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
        toast.error('Please enter a valid CGPA (0-10)');
        return;
      }
    }

    if (currentStep === 4) {
      try {
        setLoading(true);
        // Here we would generate the roadmap using Gemini AI
        // For now, just save and continue
        await updateProfile({
          targetCompanies: selectedCompanies.map(c => c.name),
          cgpa: parseFloat(cgpa),
          skills: skills
        });
        toast.success('Profile updated! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const currentStepData = ONBOARDING_STEPS[currentStep - 1];

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between mb-4">
                {ONBOARDING_STEPS.map((step) => (
                  <motion.div
                    key={step.step}
                    className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                      step.step <= currentStep ? 'bg-primary-500' : 'bg-dark-300 dark:bg-dark-700'
                    }`}
                    layoutId={`step-${step.step}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-sm">
                {ONBOARDING_STEPS.map((step) => (
                  <p
                    key={step.step}
                    className={step.step <= currentStep ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-dark-500 dark:text-dark-500'}
                  >
                    Step {step.step}
                  </p>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-12"
            >
              <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
                {currentStepData.title}
              </h1>
              <p className="text-lg text-dark-600 dark:text-dark-400 mb-12">
                {currentStepData.description}
              </p>

              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg">
                    <p className="text-dark-900 dark:text-white font-semibold mb-2">
                      Welcome, {user?.name}! 🎉
                    </p>
                    <p className="text-dark-800 dark:text-dark-200">
                      We're excited to help you prepare for your placement journey. Let's set up your profile and get started!
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Target Companies */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {TOP_COMPANIES.map((company) => (
                      <motion.button
                        key={company.slug}
                        onClick={() => handleCompanyToggle(company)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCompanies.find(c => c.slug === company.slug)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                            : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="font-semibold text-dark-900 dark:text-white">{company.name}</div>
                        <div className="text-xs text-dark-600 dark:text-dark-400">{company.avgPackage}</div>
                        <div className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                          {company.role}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Selected: {selectedCompanies.length}/20+
                  </p>
                </div>
              )}

              {/* Step 3: Profile */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                      Your CGPA
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="input-field"
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2">
                      Key Skills (add multiple)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="e.g., Python, React, System Design"
                      />
                      <button className="btn-secondary px-6">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Generate Roadmap */}
              {currentStep === 4 && (
                <div className="space-y-6 text-center">
                  <div className="p-8 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Award className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                    <p className="text-dark-900 dark:text-white font-semibold mb-2">
                      AI is generating your personalized roadmap...
                    </p>
                    <p className="text-dark-700 dark:text-dark-300 text-sm">
                      Based on your profile and target companies, we're creating a customized 12-week prep plan.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-12 pt-6 border-t border-dark-200 dark:border-dark-700">
                <button
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="btn-secondary flex-1 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : currentStep === 4 ? 'Complete Setup' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
