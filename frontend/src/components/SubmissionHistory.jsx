import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    // Agar problemId undefined/null hai toh fetch mat karo
    if (!problemId) {
      setLoading(false);
      setError('No problem selected');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🔥 API Call (Aapki route ke hisaab se rakha hai)
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        
        // 🔥 Robust Data Extraction: Agar data { submissions: [...] } format mein hai toh woh lo, nahi toh direct data lo
        const submissionsData = response.data?.submissions ?? response.data ?? [];
        
        // Ensure it's always an array
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
        
      } catch (err) {
        console.error('Submission fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch submission history');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]); // problemId change hone par dobara fetch karega

  // ---------- Helper Functions (with Fallbacks) ----------
  
  const getStatusColor = (status) => {
    if (!status) return 'badge-neutral';
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      case 'accepted':
        return 'badge-success';
      case 'wrong answer':
      case 'wrong':
        return 'badge-error';
      case 'time limit exceeded':
      case 'tle':
        return 'badge-warning';
      case 'runtime error':
      case 'error':
        return 'badge-error';
      case 'pending':
      case 'processing':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    const mem = memory ?? 0; // Agar null/undefined ho toh 0
    if (mem < 1024) return `${mem} kB`;
    return `${(mem / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  // ---------- Render Logic ----------
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Submission History</h2>
      
      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => {
                  // 🔥 Safely extract values (backend se different naam aa sakte hain)
                  const passed = sub.testCasesPassed ?? sub.passedTestCases ?? 0;
                  const total = sub.testCasesTotal ?? sub.totalTestCases ?? sub.testCases?.length ?? 1;
                  
                  return (
                    <tr key={sub._id || index}>
                      <td>{index + 1}</td>
                      <td className="font-mono">{sub.language || 'N/A'}</td>
                      <td>
                        <span className={`badge ${getStatusColor(sub.status)}`}>
                          {sub.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="font-mono">{sub.runtime ?? 0}s</td>
                      <td className="font-mono">{formatMemory(sub.memory)}</td>
                      <td className="font-mono">{passed}/{total}</td>
                      <td>{formatDate(sub.createdAt || sub.submittedAt)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          Code
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* ---------- Code View Modal ---------- */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">
              Submission Details: {selectedSubmission.language || 'Code'}
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`badge ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status || 'Unknown'}
                </span>
                <span className="badge badge-outline">
                  Runtime: {selectedSubmission.runtime ?? 0}s
                </span>
                <span className="badge badge-outline">
                  Memory: {formatMemory(selectedSubmission.memory)}
                </span>
                <span className="badge badge-outline">
                  Passed: {selectedSubmission.testCasesPassed ?? selectedSubmission.passedTestCases ?? 0}/
                  {selectedSubmission.testCasesTotal ?? selectedSubmission.totalTestCases ?? 1}
                </span>
              </div>
              
              {selectedSubmission.errorMessage && (
                <div className="alert alert-error mt-2">
                  <div>
                    <span>{selectedSubmission.errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Code Display with Language Hint */}
            <div className="mockup-code bg-gray-900 text-gray-100 rounded overflow-x-auto p-4">
              <pre>
                <code>{selectedSubmission.code || '// No code available'}</code>
              </pre>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;