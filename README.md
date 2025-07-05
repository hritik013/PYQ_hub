# PYQ Hub - AI-Powered Study Assistant

A modern web application that helps students access, analyze, and learn from previous year question papers with AI-powered insights and real-time feedback system.

## 🚀 Features

### Core Functionality
- **📚 Upload PYQs**: Easily upload previous year question papers with automatic categorization
- **🔍 Browse PYQs**: Search and filter question papers by subject, semester, and year
- **🤖 AI Assistant**: Get intelligent study suggestions based on question paper analysis
- **💬 Feedback System**: Real-time feedback collection and display from Google Sheets

### Technical Features
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Real-time Feedback**: Google Sheets integration for feeOdback management
- **PDF Processing**: Advanced PDF extraction and analysis
- **AI Integration**: Intelligent study recommendations
- **Database**: Supabase integration for data management

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Services**: OpenAI API
- **Feedback System**: Google Apps Script + Google Sheets
- **PDF Processing**: PDF.js
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google account (for Google Sheets integration)
- Supabase account (for database)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pyq-hub.git
   cd pyq-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Google Sheets integration**
   - Follow the instructions in `GOOGLE_SHEETS_SETUP.md`
   - Update the Google Apps Script URL in `src/services/feedbackService.js`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Google Sheets Setup
The feedback system uses Google Sheets for data storage. Follow these steps:

1. **Create a Google Sheet** for feedback data
2. **Set up Google Apps Script** using the code in `google-apps-script.js`
3. **Deploy as Web App** and get the URL
4. **Update the URL** in `src/services/feedbackService.js`

Detailed instructions are available in `GOOGLE_SHEETS_SETUP.md`.

### Supabase Setup
1. **Create a Supabase project**
2. **Set up your database tables**
3. **Configure authentication** (if needed)
4. **Update environment variables**

## 📁 Project Structure

```
PYQ/
├── public/                 # Static assets
│   ├── logo.gif           # Application logo
│   ├── bot.png            # AI assistant icon
│   └── feedback.png       # Feedback icon
├── src/
│   ├── components/        # React components
│   │   ├── FeedbackDisplay.jsx
│   │   ├── FeedbackModal.jsx
│   │   └── Navbar.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Browse.jsx
│   │   └── AIAssistant.jsx
│   ├── services/         # API services
│   │   ├── feedbackService.js
│   │   ├── supabaseService.js
│   │   ├── aiService.js
│   │   └── pdfExtractionService.js
│   └── main.jsx          # Application entry point
├── google-apps-script.js  # Google Apps Script for feedback
└── README.md             # This file
```

## 🎯 Key Features Explained

### Feedback System
- **Real-time collection**: Users can submit feedback through a modal
- **Google Sheets integration**: All feedback is stored in Google Sheets
- **Public display**: Recent feedback is displayed on the home page
- **Multiple types**: Suggestions, comments, bug reports, and feature requests

### AI Assistant
- **Intelligent analysis**: Analyzes question papers for patterns
- **Study recommendations**: Provides personalized study suggestions
- **Context-aware**: Understands subject and difficulty levels

### PDF Processing
- **Advanced extraction**: Extracts text and structure from PDFs
- **Automatic categorization**: Categorizes questions by subject and type
- **Search optimization**: Makes content searchable and filterable

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Deploy to Netlify
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to Netlify

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. **Check the troubleshooting guide** in `TROUBLESHOOTING.md`
2. **Review the Google Sheets setup** in `GOOGLE_SHEETS_SETUP.md`
3. **Open an issue** on GitHub

## 🙏 Acknowledgments

- **Vite** for the fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **React** for the component library
- **Supabase** for the backend services
- **Google Apps Script** for the feedback system

---

**Made with ❤️ for students worldwide**
