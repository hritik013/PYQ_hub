import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const extractQuestionsFromPDF = async (pdfUrl, forceOCR = false) => {
  try {
    console.log('Starting PDF extraction from:', pdfUrl);
    if (forceOCR) {
      console.log('Force OCR mode enabled for image-based PDF');
    }
    
    // Add timeout to the entire extraction process
    const extractionPromise = (async () => {
      // Handle CORS issues by fetching the PDF first
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Load the PDF document from array buffer
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
    
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let extractedText = '';
    
    // Extract text from each page with timeout protection
    const maxPages = Math.min(pdf.numPages, 10); // Increased to 10 pages
    
    console.log(`Will extract ${maxPages} pages out of ${pdf.numPages} total pages`);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${maxPages}...`);
      
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        console.log(`Page ${pageNum} has ${textContent.items.length} text items`);
        
        // Extract text from the page with better formatting
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        console.log(`Page ${pageNum} extracted text length: ${pageText.length} characters`);
        
        // For image-based PDFs, we'll use OCR even if some text is found
        // This ensures better extraction of scanned content
        let pageExtractedText = pageText;
        
        // Use OCR if forced or if no text or very little text found
        if (forceOCR || pageText.length < 50) {
          console.log(`Page ${pageNum} has minimal text (${pageText.length} chars), using OCR...`);
          
          try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            // Use higher scale for better OCR accuracy
            const viewport = page.getViewport({ scale: 2.0 });
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            // Use Tesseract for OCR with improved settings
            const result = await Promise.race([
              Tesseract.recognize(canvas, 'eng', {
                logger: m => console.log(`OCR Progress: ${m.status} - ${m.progress * 100}%`),
                // Improved OCR settings for better accuracy
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,;:?!()[]{}-\'\"\n\r\t ',
                preserve_interword_spaces: '1'
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('OCR timeout')), 45000) // Increased timeout
              )
            ]);
            
            if (result.data.text && result.data.text.trim().length > 0) {
              pageExtractedText = result.data.text;
              console.log(`OCR extracted ${result.data.text.length} characters from page ${pageNum}`);
            } else {
              console.log(`OCR returned empty text for page ${pageNum}`);
            }
          } catch (ocrError) {
            console.log(`OCR failed for page ${pageNum}:`, ocrError.message);
            // Keep the original text if OCR fails
          }
        }
        
        if (pageExtractedText && pageExtractedText.trim().length > 0) {
          extractedText += `=== PAGE ${pageNum} ===\n${pageExtractedText}\n\n`;
        }
      } catch (pageError) {
        console.log(`Error processing page ${pageNum}:`, pageError.message);
        continue; // Continue with next page
      }
    }
    
    console.log(`Total extracted text length: ${extractedText.length} characters`);
    
    // Process the extracted text to identify questions
    const questions = processExtractedText(extractedText);
    
      console.log('Extraction completed');
      return {
        success: true,
        text: extractedText,
        questions: questions
      };
    })();
    
    // Add 60-second timeout
    const result = await Promise.race([
      extractionPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF extraction timeout')), 60000)
      )
    ]);
    
    return result;
    
  } catch (error) {
    console.error('Error extracting from PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const processExtractedText = (text) => {
  // Question detection patterns for exam-style questions
  const questionPatterns = [
    // Numbered questions: 1. What is... 2. Explain...
    /(\d+\.\s*[A-Z][^.!?]*[.!?])/g,
    
    // Sub-questions: a) Define... b) Explain...
    /([a-z]\)\s*[A-Z][^.!?]*[.!?])/g,
    
    // Roman numerals: i) What... ii) Explain...
    /([ivx]+\)\s*[A-Z][^.!?]*[.!?])/g,
    
    // Dotted sub-questions: i. Define... ii. Explain...
    /([ivx]+\.\s*[A-Z][^.!?]*[.!?])/g,
    
    // Q format: Q1. What... Q2. Explain...
    /(Q\d+\.\s*[A-Z][^.!?]*[.!?])/gi,
    
    // Question format: Question 1. What... Question 2. Explain...
    /(Question\s*\d+\.\s*[A-Z][^.!?]*[.!?])/gi,
    
    // Part format: Part A. What... Part B. Explain...
    /(Part\s*[A-Z]\.\s*[A-Z][^.!?]*[.!?])/gi,
    
    // Section format: Section A. What... Section B. Explain...
    /(Section\s*[A-Z]\.\s*[A-Z][^.!?]*[.!?])/gi,
    
    // Sub-parts: (a) What... (b) Explain...
    /\([a-z]\)\s*[A-Z][^.!?]*[.!?]/g,
    
    // Sub-parts with numbers: (1) What... (2) Explain...
    /\(\d+\)\s*[A-Z][^.!?]*[.!?]/g,
    
    // Questions ending with question mark
    /(\d+\.\s*[^.!?]*\?)/g,
    /([a-z]\)\s*[^.!?]*\?)/g,
    /([ivx]+\)\s*[^.!?]*\?)/g,
    /([ivx]+\.\s*[^.!?]*\?)/g,
    /(Q\d+\.\s*[^.!?]*\?)/gi,
    /(Question\s*\d+\.\s*[^.!?]*\?)/gi,
    /(Part\s*[A-Z]\.\s*[^.!?]*\?)/gi,
    /(Section\s*[A-Z]\.\s*[^.!?]*\?)/gi,
    /\([a-z]\)\s*[^.!?]*\?/g,
    /\(\d+\)\s*[^.!?]*\?/g,
  ];
  
  const questions = [];
  
  questionPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      questions.push(...matches);
    }
  });
  
  // Remove duplicates and clean up
  const uniqueQuestions = [...new Set(questions)]
    .map(q => q.trim())
    .filter(q => q.length > 5) // Reduced minimum length to catch shorter questions
    .filter(q => {
      // Additional filtering to ensure it's actually a question
      const questionText = q.toLowerCase();
      return (
        questionText.includes('what') || 
        questionText.includes('how') || 
        questionText.includes('why') || 
        questionText.includes('explain') || 
        questionText.includes('define') || 
        questionText.includes('describe') || 
        questionText.includes('write') || 
        questionText.includes('solve') || 
        questionText.includes('calculate') || 
        questionText.includes('prove') || 
        questionText.includes('show') || 
        questionText.includes('compare') || 
        questionText.includes('discuss') || 
        questionText.includes('analyze') || 
        questionText.includes('evaluate') ||
        questionText.includes('?') ||
        questionText.includes('draw') ||
        questionText.includes('construct') ||
        questionText.includes('implement')
      );
    })
    .slice(0, 50); // Increased limit to catch more questions
  
  console.log(`Found ${uniqueQuestions.length} questions in the text`);
  uniqueQuestions.forEach((q, index) => {
    console.log(`Question ${index + 1}: ${q.substring(0, 100)}...`);
  });
  
  return uniqueQuestions;
};

export const extractQuestionsFromImage = async (imageUrl) => {
  try {
    console.log('Starting OCR extraction from image:', imageUrl);
    
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: m => console.log(m)
    });
    
    const extractedText = result.data.text;
    const questions = processExtractedText(extractedText);
    
    return {
      success: true,
      text: extractedText,
      questions: questions
    };
    
  } catch (error) {
    console.error('Error extracting from image:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 