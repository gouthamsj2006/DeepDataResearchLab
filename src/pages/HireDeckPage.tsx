import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, User, Calendar, Briefcase, MapPin, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const domains = [
  'All Domains',
  'Software Engineering',
  'Data Engineering', 
  'Product Management',
  'Quality Assurance',
  'DevOps',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Engineering',
  'Mobile Development'
];

const employmentTypes = [
  'All Types',
  'Full-time',
  'Internship', 
  'Contract',
  'Remote'
];

interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: number;
  skills: string[];
  matchedKeywords: string[];
  matchScore: number;
  location?: string;
  resumeUrl?: string;
}

export default function HireDeckPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All Types');
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchType, setSearchType] = useState<'filters' | 'jd'>('filters');
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user role and redirect if not HR
  useEffect(() => {
    const checkUserRole = async () => {
      if (!loading && user) {
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('auth_user_id', user.id)
            .single();

          if (profile?.role !== 'HR') {
            navigate('/');
            return;
          }
          setUserRole(profile.role);
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/');
        }
      } else if (!loading && !user) {
        navigate('/');
      }
    };

    checkUserRole();
  }, [user, loading, navigate]);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      // Simulate API call - replace with actual FastAPI endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock candidate data based on search
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          experience: 3,
          skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
          matchedKeywords: ['React', 'Node.js', 'AWS'],
          matchScore: 92,
          location: 'San Francisco, CA',
          resumeUrl: '/resume-john-doe.pdf'
        },
        {
          id: '2', 
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          experience: 5,
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
          matchedKeywords: ['Python', 'Django', 'Docker'],
          matchScore: 88,
          location: 'New York, NY',
          resumeUrl: '/resume-jane-smith.pdf'
        },
        {
          id: '3',
          name: 'Mike Johnson', 
          email: 'mike.johnson@email.com',
          experience: 2,
          skills: ['JavaScript', 'Vue.js', 'MongoDB', 'Express', 'Git'],
          matchedKeywords: ['JavaScript', 'Vue.js', 'MongoDB'],
          matchScore: 85,
          location: 'Austin, TX',
          resumeUrl: '/resume-mike-johnson.pdf'
        }
      ];
      
      setCandidates(mockCandidates);
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `✅ Found ${mockCandidates.length} matching candidates!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Search error:', error);
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '❌ Search failed. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleJDAnalysis = async () => {
    if (!jobDescription.trim()) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '⚠️ Please paste a job description first';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      return;
    }
    
    setSearchLoading(true);
    try {
      // Simulate FastAPI + MCP call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock JD-based results
      const jdCandidates: Candidate[] = [
        {
          id: '4',
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com', 
          experience: 4,
          skills: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Microservices'],
          matchedKeywords: ['React', 'TypeScript', 'AWS', 'Microservices'],
          matchScore: 95,
          location: 'Seattle, WA',
          resumeUrl: '/resume-sarah-chen.pdf'
        },
        {
          id: '5',
          name: 'David Kumar',
          email: 'david.kumar@email.com',
          experience: 6,
          skills: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'Docker'],
          matchedKeywords: ['Java', 'Spring Boot', 'Kafka'],
          matchScore: 91,
          location: 'Boston, MA',
          resumeUrl: '/resume-david-kumar.pdf'
        }
      ];
      
      setCandidates(jdCandidates);
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `✅ JD Analysis complete! Found ${jdCandidates.length} matching candidates`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('JD Analysis error:', error);
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '❌ JD Analysis failed. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } finally {
      setSearchLoading(false);
    }
  };

  const downloadResume = (candidate: Candidate) => {
    // Simulate resume download
    const link = document.createElement('a');
    link.href = candidate.resumeUrl || '#';
    link.download = `${candidate.name.replace(' ', '_')}_Resume.pdf`;
    link.click();
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `📄 Downloading ${candidate.name}'s resume...`;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  const scheduleInterview = (candidate: Candidate) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `📅 Interview scheduled with ${candidate.name}!`;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading HireDeck...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'HR') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="Company Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HireDeck
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Resume Matching</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">HR Professional</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Main Site</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setSearchType('filters')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'filters'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Filter Search
              </button>
              <button
                onClick={() => setSearchType('jd')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  searchType === 'jd'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                JD Analysis
              </button>
            </div>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            {searchType === 'filters' ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Find Candidates by Filters
                </h2>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, skills, or keywords..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Employment Type
                    </label>
                    <select
                      value={selectedEmploymentType}
                      onChange={(e) => setSelectedEmploymentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {employmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {searchLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Candidates</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  AI-Powered JD Matching
                </h2>
                
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste your Job Description here for AI-powered candidate matching..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
                
                <button
                  onClick={handleJDAnalysis}
                  disabled={searchLoading}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center space-x-2"
                >
                  {searchLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing JD...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Find Matching Candidates</span>
                    </>
                  )}
                </button>
              </>
            )}
          </motion.div>

          {/* Results Section */}
          {candidates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Matching Candidates ({candidates.length})
              </h2>
              
              <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {candidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            👤 {candidate.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ✉️ {candidate.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          🎯 {candidate.matchScore}% match
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>🧑‍💼 {candidate.experience} years exp</span>
                      </div>
                      {candidate.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{candidate.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Matched Keywords */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🔑 Matched Keywords:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    {/* All Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        💼 Skills:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadResume(candidate)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Download className="w-3 h-3" />
                        <span>📄 Resume</span>
                      </button>
                      
                      <button
                        onClick={() => scheduleInterview(candidate)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>📅 Interview</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        
          {/* Empty State */}
          {candidates.length === 0 && !searchLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No candidates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use the search filters or paste a job description to find matching candidates.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}