import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Send, FileText } from 'lucide-react';
import { sendMessageToAI } from '../services/aiService';
import { extractQuestionsFromPDF, extractQuestionsFromImage } from '../services/pdfExtractionService';

// Function to format AI response text with markdown-like formatting
const formatAIResponse = (text) => {
  if (!text) return '';
  
  return text
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks: ```code``` -> <code>code</code>
    .replace(/```(.*?)```/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Inline code: `code` -> <code>code</code>
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')
    // Bullet points
    .replace(/^•\s*/gm, '• ')
    // Numbered lists
    .replace(/^(\d+\.)\s*/gm, '$1 ');
};

const AIAssistant = () => {
  const location = useLocation();
  const pyqData = location.state?.pyq;
  
  const [messages, setMessages] = useState([
    { sender: 'ai', text: pyqData 
      ? `Hi! I'm your study assistant for ${pyqData.subject} (${pyqData.semester}, ${pyqData.year}). I can help you with questions from this PYQ paper. What would you like to know?` 
      : 'Hi! I am your study assistant. Ask me what to study for any subject.' 
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [extractedQuestions, setExtractedQuestions] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [extractedTextDisplay, setExtractedTextDisplay] = useState('');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract questions from PDF when PYQ data is available
  useEffect(() => {
    if (pyqData && pyqData.file_url) {
      handleExtractQuestions(pyqData.file_url);
    }
  }, [pyqData]);

  const handleExtractQuestions = async (pdfUrl) => {
    try {
      setExtracting(true);
      setExtractionProgress('Starting PDF extraction...');
      
      // Determine if it's a PDF or image based on URL
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(pdfUrl);
      
      let extractionResult;
      if (isImage) {
        extractionResult = await extractQuestionsFromImage(pdfUrl);
      } else {
        // Force OCR for image-based PDFs (scanned documents)
        extractionResult = await extractQuestionsFromPDF(pdfUrl, true);
      }
      
      if (extractionResult.success) {
        const { text, questions } = extractionResult;
        
        // Store the full extracted text for AI context
        setExtractedText(text);
        
        // Create a questions-only display text
        let questionsDisplayText = '';
        if (questions && questions.length > 0) {
          questionsDisplayText = `📋 EXTRACTED QUESTIONS FROM ${pyqData.subject.toUpperCase()} PYQ (${pyqData.semester}, ${pyqData.year})\n\n`;
          questions.forEach((question, index) => {
            questionsDisplayText += `📝 Question ${index + 1}:\n${question}\n\n`;
          });
          questionsDisplayText += `\nTotal: ${questions.length} questions extracted`;
        } else {
          questionsDisplayText = `No specific questions found in the PDF.\n\nExtracted text preview:\n${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`;
        }
        
        setExtractedTextDisplay(questionsDisplayText);
        setShowExtractedText(true);
        
        // Format the extracted content for AI context
        let extractedText = `Questions from ${pyqData.subject} PYQ (${pyqData.semester}, ${pyqData.year}):\n\n`;
        
        if (questions && questions.length > 0) {
          extractedText += `Found ${questions.length} questions from the PYQ:\n\n`;
          questions.forEach((question, index) => {
            extractedText += `📝 Question ${index + 1}:\n${question}\n\n`;
          });
          extractedText += `\nYou can ask me to explain any of these questions or ask for help with similar topics!`;
        } else {
          extractedText += `No specific questions found, but here's the extracted text:\n\n${text.substring(0, 1000)}${text.length > 1000 ? '...' : ''}\n\n`;
          extractedText += `You can ask me specific questions about any topic from this PYQ, and I'll help you understand and prepare for similar questions.`;
        }
        
        setExtractedQuestions(extractedText);
        setExtractionProgress('');
        
        // Add initial context message
        const contextMsg = { sender: 'ai', text: `I've extracted the text from your ${pyqData.subject} PYQ. You can now ask me questions about any topic from this document!` };
        setMessages((msgs) => [...msgs, contextMsg]);
      } else {
        throw new Error(extractionResult.error || 'Extraction failed');
      }
    } catch (error) {
      console.error('Error extracting questions:', error);
      
      // Provide a fallback message with basic context
      const fallbackText = `I couldn't extract questions from the document (${error.message}), but I can still help you with ${pyqData.subject} from ${pyqData.semester} semester, ${pyqData.year}. 

Key topics typically covered in ${pyqData.subject}:
- Core concepts and fundamentals
- Important algorithms and data structures
- Previous year question patterns
- Exam preparation strategies

Ask me any specific questions about ${pyqData.subject} and I'll help you prepare!`;
      
      setExtractedQuestions(fallbackText);
      setExtractionProgress('');
      const errorMsg = { sender: 'ai', text: fallbackText };
      setMessages((msgs) => [...msgs, errorMsg]);
    } finally {
      setExtracting(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    
    try {
      // Include PYQ context in the AI request
      const contextMessage = pyqData 
        ? `Context: I'm studying ${pyqData.subject} from ${pyqData.semester} semester, ${pyqData.year}. ${extractedQuestions ? 'Here are the extracted questions: ' + extractedQuestions : ''}`
        : '';
      
      const aiResponse = await sendMessageToAI(input, messages, contextMessage);
      const aiMsg = { sender: 'ai', text: aiResponse };
      setMessages((msgs) => [...msgs, aiMsg]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((msgs) => [...msgs, errorMsg]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Study Assistant</h1>
        {pyqData && (
          <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="font-semibold text-primary-800">Studying PYQ</span>
            </div>
            <p className="text-sm text-primary-700">
              {pyqData.subject} • {pyqData.semester} • {pyqData.year}
            </p>
          </div>
        )}
        <p className="text-gray-600">Ask what to study for any subject or exam. Get smart suggestions based on PYQs!</p>
      </div>

      {/* Extracted PDF Text Section */}
      {(showExtractedText || extracting) && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Extracted Questions</h2>
            {extractedTextDisplay && (
              <button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                {showExtractedText ? 'Hide' : 'Show'} Questions
              </button>
            )}
          </div>
          {extracting ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Extracting text from PDF using OCR...</p>
              {extractionProgress && (
                <p className="text-sm text-primary-600 mt-2">{extractionProgress}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">OCR processing may take 1-2 minutes for scanned documents</p>
            </div>
          ) : extractedTextDisplay ? (
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {extractedTextDisplay}
              </pre>
            </div>
          ) : null}
        </div>
      )}
      <div className="card h-[500px] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex items-end space-x-2 ${msg.sender === 'ai' ? '' : 'flex-row-reverse'}`}>
                {msg.sender === 'ai' ? (
                  <img src="/bot.png" alt="AI Assistant" className="h-6 w-6 object-cover" />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
                <div className={`rounded-lg px-4 py-2 ${msg.sender === 'ai' ? 'bg-primary-100 text-gray-900 max-w-md' : 'bg-primary-600 text-white max-w-xs'}`}>
                  {msg.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <img src="/bot.png" alt="AI Assistant" className="h-6 w-6 object-cover" />
                <div className="bg-primary-100 text-gray-900 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {extracting && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <img src="/bot.png" alt="AI Assistant" className="h-6 w-6 object-cover" />
                <div className="bg-primary-100 text-gray-900 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span className="text-sm">Extracting questions from PDF...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex items-center border-t border-gray-200 p-3 bg-white">
          <input
            type="text"
            className="input-field flex-1 mr-2"
            placeholder="Ask about a subject or exam..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant; 