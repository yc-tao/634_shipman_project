import React, { useState } from 'react';
import { Search, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});

  const searchJobs = async (term) => {
    if (!term?.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5021/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ content: term }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format');
      }

      const jobsText = data.choices[0].message.content;
      
      const jobsList = jobsText.split('-----------------------------------')
        .filter(job => job.trim())
        .map((job, index) => {
          const lines = job.trim().split('\n');
          const jobData = {};
          lines.forEach(line => {
            const [key, ...value] = line.split(': ');
            jobData[key.toLowerCase()] = value.join(': ');
          });
          return { ...jobData, uniqueId: Date.now() + index };
        });

      if (jobsList.length === 0) {
        throw new Error('No jobs found matching your criteria');
      }

      setJobs(jobsList);
      setError('');
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    searchJobs(searchTerm);
  };

  const handleRedo = () => {
    if (searchTerm) {
      // Reset feedback but keep the search term
      setFeedbackGiven({});
      // Perform the search again with the same term
      searchJobs(searchTerm);
    }
  };

  const handleFeedback = (jobId, isPositive) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [jobId]: isPositive
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">Job Search</h2>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter job search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="min-w-[100px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⌛</span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <Search className="h-4 w-4" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={loading || !searchTerm}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed relative group"
            title="Redo search with current term"
          >
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Redo search: {searchTerm}
            </span>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.uniqueId} className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeedback(job.uniqueId, true)}
                    disabled={feedbackGiven[job.uniqueId] !== undefined}
                    className={`p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                      ${feedbackGiven[job.uniqueId] === true ? 'bg-green-100 border-green-300' : ''}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback(job.uniqueId, false)}
                    disabled={feedbackGiven[job.uniqueId] !== undefined}
                    className={`p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                      ${feedbackGiven[job.uniqueId] === false ? 'bg-red-100 border-red-300' : ''}`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.job_type}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Posted:</strong> {job.date_posted}</p>
                <p className="mt-4"><strong>Description:</strong></p>
                <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
                <a
                  href={job.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  View Job Posting
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
