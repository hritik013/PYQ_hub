import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, X, CheckCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { savePYQToSupabase } from '../services/supabaseService';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dgu8cjthr/auto/upload';
const UPLOAD_PRESET = 'pyq_unsigned';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const response = await axios.post(CLOUDINARY_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    semester: '',
    year: '',
    examtype: '',
    description: '',
    course: '',
  });

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) added successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: true,
  });

  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!formData.subject || !formData.semester || !formData.year || !formData.course) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const fileObj of files) {
        const result = await uploadToCloudinary(fileObj.file);
        uploaded.push({
          name: fileObj.file.name,
          url: result.secure_url,
          size: fileObj.file.size,
          type: fileObj.file.type,
        });
        // Save metadata to Supabase for each file
        await savePYQToSupabase({
          subject: formData.subject,
          semester: formData.semester,
          year: parseInt(formData.year),
          examtype: formData.examtype,
          description: formData.description,
          course: formData.course,
          file_url: result.secure_url,
          file_name: fileObj.file.name,
          file_size: fileObj.file.size,
        });
      }
      setUploadedFiles(prev => [...prev, ...uploaded]);
      toast.success('Files uploaded to Cloudinary & saved to Supabase!');
      setFiles([]);
      setFormData({
        subject: '',
        semester: '',
        year: '',
        examtype: '',
        description: '',
        course: '',
      });
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const examTypes = ['Mid Semester', 'End Semester', 'Unit Test', 'Quiz', 'Assignment'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Previous Year Question Papers</h1>
        <p className="text-gray-600">Share your question papers with the community and help fellow students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-primary-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop files here, or <span className="text-primary-600">click to select</span>
                  </p>
                  <p className="text-sm text-gray-500">Supports PDF, PNG, JPG files</p>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-3">
                {files.map((fileObj) => (
                  <div key={fileObj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fileObj.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files ({uploadedFiles.length})</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" /> View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Paper Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech(C.S.E)">B.Tech(C.S.E)</option>
                  <option value="B.C.A">B.C.A</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures and Algorithms"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester * <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year * <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                  min="2000"
                  max="2030"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type
                </label>
                <select
                  name="examtype"
                  value={formData.examtype}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this question paper..."
                  rows="4"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    <span>Upload PYQ</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Upload Guidelines */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Upload Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Ensure files are clear and readable</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Provide accurate subject and semester information</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Maximum file size: 10MB per file</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Supported formats: PDF, PNG, JPG</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload; 