import { useState, useEffect } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPYQsFromSupabase } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';

const unique = (arr) => [...new Set(arr)];

const Browse = () => {
  const [pyqs, setPyqs] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    year: '',
    search: '',
    course: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPYQs();
  }, []);

  const loadPYQs = async () => {
    try {
      const data = await fetchPYQsFromSupabase();
      setPyqs(data);
    } catch (error) {
      toast.error('Failed to load PYQs');
    }
  };

  // Filter out empty/null values for dropdowns
  const subjects = unique(pyqs.map((q) => q.subject).filter(Boolean));
  const semesters = unique(pyqs.map((q) => q.semester).filter(Boolean));
  const years = unique(pyqs.map((q) => q.year).filter(Boolean));
  const courses = ['B.Tech(C.S.E)', 'B.C.A'];

  // Debug logs
  console.log('pyqs:', pyqs);
  console.log('subjects:', subjects);
  console.log('semesters:', semesters);
  console.log('years:', years);

  const filteredPYQs = pyqs.filter((q) => {
    const matchesSearch =
      !filters.search ||
      (q.subject && q.subject.toLowerCase().includes(filters.search.toLowerCase())) ||
      (q.description && q.description.toLowerCase().includes(filters.search.toLowerCase()));
    return (
      matchesSearch &&
      (!filters.subject || q.subject === filters.subject) &&
      (!filters.semester || q.semester === filters.semester) &&
      (!filters.year || String(q.year) === String(filters.year)) &&
      (!filters.course || q.course === filters.course)
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Previous Year Question Papers</h1>
        <p className="text-gray-600">Filter and search PYQs by subject, semester, year, or keywords</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by subject or description"
            className="input-field max-w-xs"
          />
          <select
            name="course"
            value={filters.course}
            onChange={handleChange}
            className="input-field max-w-xs"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <select
            name="subject"
            value={filters.subject}
            onChange={handleChange}
            className="input-field max-w-xs"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            className="input-field max-w-xs"
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="input-field max-w-xs"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PYQ List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPYQs.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No PYQs found for selected filters or search.</p>
            <p className="text-gray-400">Try adjusting your filters or upload the first PYQ!</p>
          </div>
        ) : (
          filteredPYQs.map((pyq) => (
            <div key={pyq.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pyq.subject}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{pyq.semester} • {pyq.year}</p>
                    {pyq.examtype && <p>Exam Type: {pyq.examtype}</p>}
                    <p>Uploaded: {formatDate(pyq.created_at)}</p>
                  </div>
                </div>
                {pyq.description && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {pyq.description}
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{pyq.file_name}</p>
                        <p className="text-gray-500">{formatFileSize(pyq.file_size)}</p>
                      </div>
                    </div>
                    <a
                      href={pyq.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-3 py-1 flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </a>
                  </div>
                  <button
                    className="btn-secondary w-full mt-2"
                    onClick={() => navigate('/ai-assistant', { state: { pyq } })}
                  >
                    Study via AI
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Browse; 