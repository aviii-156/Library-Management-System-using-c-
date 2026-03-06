# Library Management System - Full Stack

A complete library management system with React frontend and C++ REST API backend.

## 📋 Features

### 📖 Book Management
- View all books in the library
- Add new books with detailed information
- Track book availability and quantity
- Filter books by status

### 🔍 Smart Search
- Search books by title, author, or category
- Real-time search results
- Multiple search filters

### 📅 Issue & Return Tracking
- Track currently issued books
- Monitor return statuses (On Time, Late)
- View issue and due dates
- Track overdue books

### 👨‍🎓 Member Management
- View all library members
- Check member details and contact info
- Track books issued per member
- Monitor membership status

### 📊 Reports & Analytics
- Visual bar charts of most issued books
- Real-time statistics
- Issue tracking metrics
- Summary cards for key metrics

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite 5
- CSS3 with Glass-morphism effects
- Google Fonts (Inter, Poppins)

**Backend:**
- C++ 17
- WinSock2 (Windows Sockets)
- JSON REST API
- Port: 3001

## 📦 Prerequisites

### Frontend
- Node.js 16+ 
- npm

### Backend
- C++ compiler (g++ recommended)
- MinGW (for Windows)
- WinSock2 support

## 🚀 Setup & Running

### 1. Setup Frontend

```bash
cd c:\Users\itsun\OneDrive\Desktop\vs code\cpp project
npm install
```

### 2. Compile Backend

```bash
cd backend
build_and_run.bat
```

Or manually:
```bash
g++ -o server.exe server.cpp -lws2_32 -std=c++17
server.exe
```

Set AI API key in terminal before running backend:
```powershell
$env:GROQ_API_KEY="your_groq_api_key"
```

The backend will start on `http://localhost:3001`

### 3. Start Frontend Development Server

```bash
npm run dev
```

Open browser to `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📚 API Endpoints

### Book Management
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book

### Smart Search
- `GET /api/search?q=query` - Search books

### Issue & Return Tracking
- `GET /api/issued-books` - Get issued books
- `GET /api/returned-books` - Get returned books

### Member Management
- `GET /api/members` - Get all members

### Reports & Analytics
- `GET /api/analytics` - Get issue statistics

### AI Assistant
- `POST /api/chat` - Ask AI with library data context and perform chat-driven operations

## 📝 Data Structures

### Book
```json
{
  "id": 1,
  "title": "DBMS",
  "author": "Navathe",
  "isbn": "978-0132145374",
  "publisher": "Pearson",
  "year": 2015,
  "category": "Computer Science",
  "quantity": 5,
  "description": "Database Management Systems",
  "status": "Available"
}
```

### Member
```json
{
  "id": 1,
  "name": "Rahul Kumar",
  "studentId": "23BCS10289",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "membershipDate": "2023-08-15",
  "booksIssued": 1,
  "status": "Active"
}
```

## 🎨 UI Features

- **Centered Navbar** - Brand name and navigation features
- **Glass-morphism Effects** - Modern frosted glass design
- **Gradient Glows** - Orange accent (#ff7a00 - #ff9a2b)
- **Smooth Animations** - Fade-in, slide-up, pulse effects
- **Responsive Design** - Mobile, tablet, desktop optimized
- **Dark Theme** - Professional dark background
- **Status Badges** - Color-coded status indicators

## 🔄 How It Works

1. **Frontend** loads and initializes with React
2. **User navigates** between different features using navbar
3. **useEffect hook** triggers API calls to backend based on active feature
4. **Backend** processes requests and returns JSON data
5. **Frontend** renders data with beautiful animations and styling
6. **Real-time updates** for search, analytics, and member management

## 🐛 Troubleshooting

### Backend Won't Start
- Check if port 3001 is in use: `netstat -ano | findstr :3001`
- Ensure g++ is installed: `g++ --version`
- Check Windows Firewall settings

### CORS Errors
- Backend includes CORS headers automatically
- Ensure backend is running before frontend

### Search Not Working
- Verify book titles in database match search query
- Check browser console for API errors
- Ensure backend endpoint is `/api/search?q=query`

## 📊 Default Test Data

### Books
1. DBMS - Navathe (Available)
2. Data Structures - Tanenbaum (Available)
3. Operating Systems - Galvin (Issued)
4. Computer Networks - Forouzan (Available)

### Members
- Rahul Kumar (23BCS10289)
- Priya Sharma (23BCS10234)
- Amit Singh (23BCS10156)
- Sneha Gupta (23BCS10178)
- Vikram Patel (23BCS10267)

### Issued Books
- Operating Systems → Rahul Kumar (Active)
- Computer Networks → Priya Sharma (Active)
- Software Engineering → Amit Singh (Overdue)

## 🎯 Future Enhancements

- Database integration (SQLite/MySQL)
- User authentication
- Email notifications
- PDF report generation
- Advanced search filters
- Book reservations
- Fine management
- Mobile app
- Dark/Light mode toggle

## 📄 License

Free to use for educational purposes

## 👤 Author

Library Management System - 2026

---

**Enjoy managing your library! 📚**
