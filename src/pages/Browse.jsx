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
    content_type: '',
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

  // Prefer canonical subject name from related subjects table, fallback to text column
  const getSubjectName = (q) => (q.subjects && q.subjects.name) || q.subject || '';

  // Filter out empty/null values for dropdowns
  const subjects = unique(pyqs.map((q) => getSubjectName(q)).filter(Boolean));
  const semesters = unique(pyqs.map((q) => q.semester).filter(Boolean));
  const years = unique(pyqs.map((q) => q.year).filter(Boolean));
  const courses = ['B.Tech(C.S.E)', 'B.C.A'];
  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'pyq', label: 'PYQs only' },
    { value: 'notes', label: 'Notes only' },
  ];

  // Debug logs
  console.log('pyqs:', pyqs);
  console.log('subjects:', subjects);
  console.log('semesters:', semesters);
  console.log('years:', years);

  const filteredPYQs = pyqs.filter((q) => {
    const subjectName = getSubjectName(q);
    const matchesSearch =
      !filters.search ||
      (subjectName && subjectName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (q.description && q.description.toLowerCase().includes(filters.search.toLowerCase()));
    return (
      matchesSearch &&
      (!filters.subject || subjectName === filters.subject) &&
      (!filters.semester || q.semester === filters.semester) &&
      (!filters.year || String(q.year) === String(filters.year)) &&
      (!filters.course || q.course === filters.course) &&
      // Treat records with no content_type as PYQs for backward compatibility
      (!filters.content_type ||
        (filters.content_type === 'pyq' && (!q.content_type || q.content_type === 'pyq')) ||
        (filters.content_type === 'notes' && q.content_type === 'notes'))
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
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Browse PYQ and Notes
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Filter and search previous year question papers and notes by subject, semester, year, or keywords
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="card mx-4 sm:mx-0 space-y-4">
        {/* Top row: search + course */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by subject or description"
            className="input-field w-full md:max-w-xs text-sm sm:text-base"
          />
          <select
            name="course"
            value={filters.course}
            onChange={handleChange}
            className="input-field w-full md:max-w-xs text-sm sm:text-base"
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
            className="input-field w-full md:max-w-xs text-sm sm:text-base"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Middle row: type toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Show:
          </p>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, content_type: '' }))}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 transition-colors ${
                !filters.content_type
                  ? 'bg-white text-primary-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, content_type: 'pyq' }))}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 border-l border-gray-200 transition-colors ${
                filters.content_type === 'pyq'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              PYQs
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, content_type: 'notes' }))}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 border-l border-gray-200 transition-colors ${
                filters.content_type === 'notes'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Bottom row: semester + year */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
          <select
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            className="input-field w-full md:max-w-xs text-sm sm:text-base"
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
            className="input-field w-full md:max-w-xs text-sm sm:text-base"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PYQ List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {filteredPYQs.length === 0 ? (
          <div className="col-span-full text-center py-6 sm:py-8">
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">No PYQs found for selected filters or search.</p>
            <p className="text-gray-400 text-sm sm:text-base">Try adjusting your filters or upload the first PYQ!</p>
          </div>
        ) : (
          filteredPYQs.map((pyq) => (
            <div key={pyq.id} className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {getSubjectName(pyq)}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium ${
                        !pyq.content_type || pyq.content_type === 'pyq'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {!pyq.content_type || pyq.content_type === 'pyq' ? 'PYQ' : 'Notes'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p>{pyq.semester} • {pyq.year}</p>
                    {pyq.examtype && <p>Exam Type: {pyq.examtype}</p>}
                    <p>Uploaded: {formatDate(pyq.created_at)}</p>
                  </div>
                </div>
                {pyq.description && (
                  <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
                    {pyq.description.length > 100 
                      ? `${pyq.description.substring(0, 100)}...` 
                      : pyq.description
                    }
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <div className="text-xs sm:text-sm min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{pyq.file_name}</p>
                        <p className="text-gray-500">{formatFileSize(pyq.file_size)}</p>
                      </div>
                    </div>
                    <a
                      href={pyq.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-2 sm:px-3 py-1 flex items-center space-x-1 flex-shrink-0 ml-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </a>
                  </div>
                  <button
                    className="btn-secondary w-full mt-2 text-xs sm:text-sm py-2"
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