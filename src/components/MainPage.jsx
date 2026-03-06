import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

const navigationFeatures = [
  {
    id: 'book-management',
    icon: '📖',
    title: 'Book Management',
  },
  {
    id: 'smart-search',
    icon: '🔍',
    title: 'Smart Search',
  },
  {
    id: 'issue-tracking',
    icon: '📅',
    title: 'Issue & Return Tracking',
  },
  {
    id: 'member-management',
    icon: '👨‍🎓',
    title: 'Member Management',
  },
  {
    id: 'reports-analytics',
    icon: '📊',
    title: 'Reports & Analytics',
  },
];

function MainPage({ onBack }) {
  const [activeFeature, setActiveFeature] = useState('book-management');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueBookModalOpen, setIsIssueBookModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Hi! Main aapka AI library assistant hoon. Aap books/members data puchh sakte ho, aur operations commands bhi de sakte ho.'
    }
  ]);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Form state for adding books
  const [formData, setFormData] = useState({
    bookTitle: '',
    bookAuthor: '',
    bookISBN: '',
    bookPublisher: '',
    bookYear: new Date().getFullYear(),
    bookCategory: 'Computer Science',
    bookQuantity: 1,
    bookDescription: ''
  });

  // Form state for issuing books
  const [issueFormData, setIssueFormData] = useState({
    memberName: '',
    studentId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  // State for data from backend
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data on component mount and feature change
  useEffect(() => {
    fetchData();
  }, [activeFeature]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeFeature) {
        case 'book-management':
          await fetchBooks();
          break;
        case 'smart-search':
          // Search results loaded on demand
          break;
        case 'issue-tracking':
          await fetchIssuedBooks();
          await fetchReturnedBooks();
          break;
        case 'member-management':
          await fetchMembers();
          break;
        case 'reports-analytics':
          await fetchAnalytics();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issued-books`);
      const data = await response.json();
      setIssuedBooks(data);
    } catch (error) {
      console.error('Error fetching issued books:', error);
    }
  };

  const fetchReturnedBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/returned-books`);
      const data = await response.json();
      setReturnedBooks(data);
    } catch (error) {
      console.error('Error fetching returned books:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getRadarChartData = () => {
    const size = 520;
    const center = size / 2;
    const radius = 142;
    const ringLevels = [20, 40, 60, 80, 100];
    const maxIssueCount = analytics.reduce((max, book) => Math.max(max, Number(book.issueCount) || 0), 0);

    const points = analytics.map((book, index) => {
      const angle = (-Math.PI / 2) + (index * (2 * Math.PI)) / analytics.length;
      const percentageFromApi = Number(book.percentage);
      const issueCount = Number(book.issueCount) || 0;
      const valuePercent = Number.isFinite(percentageFromApi)
        ? Math.max(0, Math.min(100, percentageFromApi))
        : (maxIssueCount > 0 ? Math.round((issueCount * 100) / maxIssueCount) : 0);

      const pointRadius = (valuePercent / 100) * radius;
      const x = center + pointRadius * Math.cos(angle);
      const y = center + pointRadius * Math.sin(angle);
      const outerX = center + radius * Math.cos(angle);
      const outerY = center + radius * Math.sin(angle);
      const labelX = center + (radius + 44) * Math.cos(angle);
      const labelY = center + (radius + 44) * Math.sin(angle);

      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.32) textAnchor = 'start';
      if (Math.cos(angle) < -0.32) textAnchor = 'end';

      const labelDy = Math.sin(angle) > 0.55 ? 14 : (Math.sin(angle) < -0.55 ? -8 : 4);

      return {
        ...book,
        x,
        y,
        outerX,
        outerY,
        labelX,
        labelY: labelY + labelDy,
        textAnchor,
        valuePercent
      };
    });

    const getPolygonByLevel = (level) => {
      const levelRadius = (level / 100) * radius;
      return points
        .map((point, index) => {
          const angle = (-Math.PI / 2) + (index * (2 * Math.PI)) / analytics.length;
          const x = center + levelRadius * Math.cos(angle);
          const y = center + levelRadius * Math.sin(angle);
          return `${x},${y}`;
        })
        .join(' ');
    };

    return {
      size,
      center,
      points,
      rings: ringLevels.map((level) => ({ level, polygon: getPolygonByLevel(level) })),
      valuePolygon: points.map((point) => `${point.x},${point.y}`).join(' ')
    };
  };

  const radarChartData = getRadarChartData();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeFeature) {
      case 'book-management':
        return (
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-title-group">
                <span className="feature-icon-large" aria-hidden="true">📖</span>
                <div>
                  <h1>Book Management</h1>
                  <p>Add, update, and organize books effortlessly with a centralized digital system.</p>
                </div>
              </div>
              <button className="btn btn-primary add-book-btn" onClick={() => setIsAddBookModalOpen(true)}>
                ➕ Add Book
              </button>
            </div>

            {books.length > 0 ? (
              <div className="books-table-container">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td>📚 {book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span className={`status-badge status-${book.status.toLowerCase()}`}>
                            {book.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-delete-small"
                            onClick={() => handleDeleteBook(book.id)}
                            title="Delete book"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">📚</span>
                <h3>No books available</h3>
                <p>Click "Add Book" to begin building your library collection</p>
              </div>
            )}
          </div>
        );

      case 'smart-search':
        return (
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-title-group">
                <span className="feature-icon-large" aria-hidden="true">🔍</span>
                <div>
                  <h1>Smart Search</h1>
                  <p>Find books instantly by title, author, or category.</p>
                </div>
              </div>
            </div>
            
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title, author, or category..."
                  aria-label="Search books"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="btn btn-primary search-btn"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  🔍 {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              <div className="search-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Title</button>
                <button className="filter-btn">Author</button>
                <button className="filter-btn">Category</button>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="books-table-container">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((book) => (
                      <tr key={book.id}>
                        <td>📚 {book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span className={`status-badge status-${book.status.toLowerCase()}`}>
                            {book.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-issue"
                            onClick={() => {
                              setSelectedBookForIssue(book);
                              setIsIssueBookModalOpen(true);
                            }}
                            title="Issue this book"
                          >
                            📤 Issue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">🔍</span>
                <h3>{searchQuery ? 'No results found' : 'Start searching'}</h3>
                <p>{searchQuery ? 'Try different keywords' : 'Enter keywords to find books in the library collection'}</p>
              </div>
            )}
          </div>
        );

      case 'issue-tracking':
        return (
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-title-group">
                <span className="feature-icon-large" aria-hidden="true">📅</span>
                <div>
                  <h1>Issue & Return Tracking</h1>
                  <p>Monitor issued books and due dates.</p>
                </div>
              </div>
            </div>

            {/* Issued Books Section */}
            <div className="tracking-section">
              <div className="section-header">
                <h2 className="section-title">📤 Currently Issued Books</h2>
                <span className="badge-count">{issuedBooks.length} Books</span>
              </div>
              
              {issuedBooks.length > 0 ? (
                <div className="books-table-container">
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>Book Title</th>
                        <th>Member</th>
                        <th>Student ID</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issuedBooks.map((book) => (
                        <tr key={book.id}>
                          <td>📚 {book.title}</td>
                          <td>{book.member}</td>
                          <td>{book.studentId}</td>
                          <td>{book.issueDate}</td>
                          <td>{book.dueDate}</td>
                          <td>
                            <span className={`status-badge status-${book.status.toLowerCase()}`}>
                              {book.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-return"
                              onClick={() => handleReturnBook(book.id)}
                              title="Return book"
                            >
                              ↩️ Return
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-state-icon" aria-hidden="true">📤</span>
                  <h3>No issued books</h3>
                  <p>All books are currently available in the library</p>
                </div>
              )}
            </div>

            {/* Returned Books Section */}
            <div className="tracking-section">
              <div className="section-header">
                <h2 className="section-title">✅ Recently Returned Books</h2>
                <span className="badge-count">{returnedBooks.length} Returns</span>
              </div>
              
              {returnedBooks.length > 0 ? (
                <div className="books-table-container">
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>Book Title</th>
                        <th>Member</th>
                        <th>Student ID</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnedBooks.map((book) => (
                        <tr key={book.id}>
                          <td>📚 {book.title}</td>
                          <td>{book.member}</td>
                          <td>{book.studentId}</td>
                          <td>{book.issueDate}</td>
                          <td>{book.returnDate}</td>
                          <td>
                            <span className={`status-badge status-${book.status.toLowerCase().replace(' ', '-')}`}>
                              {book.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-state-icon" aria-hidden="true">✅</span>
                  <h3>No returns yet</h3>
                  <p>Returned books will appear here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'member-management':
        return (
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-title-group">
                <span className="feature-icon-large" aria-hidden="true">👨‍🎓</span>
                <div>
                  <h1>Member Management</h1>
                  <p>Manage students and library users efficiently.</p>
                </div>
              </div>
            </div>

            {members.length > 0 ? (
              <div className="books-table-container">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Email</th>
                      <th>Books Issued</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.studentId}</td>
                        <td>{member.email}</td>
                        <td>{member.booksIssued}</td>
                        <td>
                          <span className={`status-badge status-${member.status.toLowerCase()}`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">👨‍🎓</span>
                <h3>No members found</h3>
                <p>Member list will appear here</p>
              </div>
            )}
          </div>
        );

      case 'reports-analytics':
        return (
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-title-group">
                <span className="feature-icon-large" aria-hidden="true">📊</span>
                <div>
                  <h1>Reports & Analytics</h1>
                  <p>Track usage and maintain accurate records.</p>
                </div>
              </div>
            </div>

            {/* Most Issued Books Chart */}
            <div className="analytics-section">
              <div className="section-header">
                <h2 className="section-title">📈 Most Issued Books</h2>
                <span className="badge-count">Top {analytics.length} Books</span>
              </div>

              <div className="chart-container">
                {analytics.length > 0 ? (
                  <div className="radar-layout">
                    <div className="radar-chart-wrapper">
                      <svg className="radar-chart" viewBox={`0 0 ${radarChartData.size} ${radarChartData.size}`} aria-label="Most issued books radar chart">
                        {radarChartData.rings.map((ring) => (
                          <polygon key={ring.level} className="radar-grid-ring" points={ring.polygon} />
                        ))}

                        {radarChartData.points.map((point) => (
                          <line
                            key={`spoke-${point.id}`}
                            className="radar-spoke"
                            x1={radarChartData.center}
                            y1={radarChartData.center}
                            x2={point.outerX}
                            y2={point.outerY}
                          />
                        ))}

                        <polygon className="radar-area" points={radarChartData.valuePolygon} />
                        <polyline className="radar-outline" points={`${radarChartData.valuePolygon} ${radarChartData.points[0]?.x},${radarChartData.points[0]?.y}`} />

                        {radarChartData.points.map((point) => (
                          <circle key={`dot-${point.id}`} className="radar-point" cx={point.x} cy={point.y} r="6" />
                        ))}

                        {radarChartData.points.map((point) => (
                          <text
                            key={`label-${point.id}`}
                            className="radar-axis-label"
                            x={point.labelX}
                            y={point.labelY}
                            textAnchor={point.textAnchor}
                          >
                            <tspan className="radar-axis-title" x={point.labelX}>{point.title}</tspan>
                            <tspan className="radar-axis-value" x={point.labelX} dy="22">{point.valuePercent}%</tspan>
                          </text>
                        ))}
                      </svg>
                    </div>

                    <div className="radar-book-list">
                      {radarChartData.points.map((book, index) => (
                        <div key={`book-${book.id}`} className="radar-book-item">
                          <span className="radar-book-rank">#{index + 1}</span>
                          <span className="radar-book-title">{book.title}</span>
                          <span className="radar-book-count">{book.issueCount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-state-icon" aria-hidden="true">📊</span>
                    <h3>Loading analytics...</h3>
                    <p>Data will be displayed here</p>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <div className="stat-value">{issuedBooks.length + returnedBooks.length}</div>
                    <div className="stat-label">Total Issues</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-value">{returnedBooks.length}</div>
                    <div className="stat-label">Returned</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📤</div>
                  <div className="stat-info">
                    <div className="stat-value">{issuedBooks.length}</div>
                    <div className="stat-label">Currently Issued</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <div className="stat-value">{issuedBooks.filter(b => b.status === 'Overdue').length}</div>
                    <div className="stat-label">Overdue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.bookTitle,
          author: formData.bookAuthor,
          isbn: formData.bookISBN,
          publisher: formData.bookPublisher,
          year: parseInt(formData.bookYear),
          category: formData.bookCategory,
          quantity: parseInt(formData.bookQuantity),
          description: formData.bookDescription
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('✓ Book added successfully!', 'success');
        setFormData({
          bookTitle: '',
          bookAuthor: '',
          bookISBN: '',
          bookPublisher: '',
          bookYear: new Date().getFullYear(),
          bookCategory: 'Computer Science',
          bookQuantity: 1,
          bookDescription: ''
        });
        setIsAddBookModalOpen(false);
        await fetchBooks();
      } else {
        showNotification('✗ Failed to add book', 'error');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      showNotification('✗ Error adding book', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('✓ Book deleted successfully!', 'success');
        await fetchBooks();
      } else {
        showNotification('✗ Failed to delete book', 'error');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showNotification('✗ Error deleting book', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/return-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: bookId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('✓ Book returned successfully!', 'success');
        await fetchIssuedBooks();
        await fetchReturnedBooks();
      } else {
        showNotification('✗ Failed to return book', 'error');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      showNotification('✗ Error returning book', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIssueFormChange = (e) => {
    const { name, value } = e.target;
    setIssueFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    
    if (!selectedBookForIssue) {
      showNotification('✗ No book selected', 'error');
      return;
    }

    if (!issueFormData.memberName || !issueFormData.studentId) {
      showNotification('✗ Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/issue-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: selectedBookForIssue.id,
          bookTitle: selectedBookForIssue.title,
          memberName: issueFormData.memberName,
          studentId: issueFormData.studentId,
          issueDate: issueFormData.issueDate,
          dueDate: issueFormData.dueDate
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification('✓ Book issued successfully!', 'success');
        setIssueFormData({
          memberName: '',
          studentId: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        setSelectedBookForIssue(null);
        setIsIssueBookModalOpen(false);
        await fetchIssuedBooks();
      } else {
        showNotification('✗ Failed to issue book', 'error');
      }
    } catch (error) {
      console.error('Error issuing book:', error);
      showNotification('✗ Error issuing book', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const result = await response.json();
      const reply = result?.reply || 'Sorry, chatbot response nahi aa paaya.';

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: reply,
        },
      ]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: 'Backend se connect nahi ho paaya. Ensure server run ho raha hai aur GROQ_API_KEY set hai.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="main-page">      <nav className="main-navbar">
        <div className="navbar-brand">
          <span className="brand-icon" aria-hidden="true">📚</span>
          <span className="brand-text">Library Management System</span>
        </div>
        <ul className="navbar-links">
          {navigationFeatures.map((feature) => (
            <li key={feature.id}>
              <button
                className={`nav-link ${activeFeature === feature.id ? 'active' : ''}`}
                onClick={() => setActiveFeature(feature.id)}
                aria-current={activeFeature === feature.id ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">{feature.icon}</span>
                <span className="nav-text">{feature.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <button 
          className="btn-back-navbar"
          onClick={onBack}
          title="Go back to previous page"
        >
          ← Back
        </button>
      </nav>

      <main className="main-content container">
        {renderContent()}
      </main>

      <div className="floating-chat-wrapper">
        {isChatOpen && (
          <div className="floating-chat-panel" role="dialog" aria-label="AI chat panel">
            <div className="floating-chat-header">
              <div className="floating-chat-title">AI Assistant</div>
              <button
                className="floating-chat-close"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="floating-chat-messages">
              {chatMessages.map((message) => (
                <div key={message.id} className={`chat-message ${message.role === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}>
                  {message.text}
                </div>
              ))}
              {isChatLoading && (
                <div className="chat-message chat-message-bot">
                  Typing...
                </div>
              )}
            </div>

            <form className="floating-chat-input-row" onSubmit={handleSendChatMessage}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                aria-label="Chat message"
                disabled={isChatLoading}
              />
              <button type="submit" className="floating-chat-send" disabled={isChatLoading}>Send</button>
            </form>
          </div>
        )}

        <button
          className={`floating-chat-button ${isChatOpen ? 'active' : ''}`}
          onClick={() => setIsChatOpen((prev) => !prev)}
          aria-label="Open AI chat"
          title="Open AI chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bot-icon lucide-bot chat-bot-icon"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path className="chat-bot-eye chat-bot-eye-right" d="M15 13v2" />
            <path className="chat-bot-eye chat-bot-eye-left" d="M9 13v2" />
          </svg>
        </button>
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Add Book Modal */}
      {isAddBookModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddBookModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📖 Add New Book</h2>
              <button className="modal-close-btn" onClick={() => setIsAddBookModalOpen(false)}>
                ✕
              </button>
            </div>
            
            <form className="add-book-form" onSubmit={handleAddBook}>
              <div className="form-group">
                <label htmlFor="bookTitle">Book Title *</label>
                <input
                  type="text"
                  id="bookTitle"
                  name="bookTitle"
                  placeholder="Enter book title"
                  value={formData.bookTitle}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookAuthor">Author *</label>
                <input
                  type="text"
                  id="bookAuthor"
                  name="bookAuthor"
                  placeholder="Enter author name"
                  value={formData.bookAuthor}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookISBN">ISBN</label>
                  <input
                    type="text"
                    id="bookISBN"
                    name="bookISBN"
                    placeholder="Enter ISBN number"
                    value={formData.bookISBN}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookPublisher">Publisher</label>
                  <input
                    type="text"
                    id="bookPublisher"
                    name="bookPublisher"
                    placeholder="Enter publisher name"
                    value={formData.bookPublisher}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookYear">Publication Year</label>
                  <input
                    type="number"
                    id="bookYear"
                    name="bookYear"
                    placeholder="2024"
                    min="1900"
                    max="2026"
                    value={formData.bookYear}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookCategory">Category</label>
                  <select 
                    id="bookCategory" 
                    name="bookCategory"
                    value={formData.bookCategory}
                    onChange={handleFormChange}
                  >
                    <option value="">Select category</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bookQuantity">Number of Copies *</label>
                <input
                  type="number"
                  id="bookQuantity"
                  name="bookQuantity"
                  placeholder="Enter quantity"
                  min="1"
                  value={formData.bookQuantity}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookDescription">Description</label>
                <textarea
                  id="bookDescription"
                  name="bookDescription"
                  placeholder="Enter book description (optional)"
                  rows="4"
                  value={formData.bookDescription}
                  onChange={handleFormChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddBookModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '⏳ Adding...' : '➕ Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueBookModalOpen && selectedBookForIssue && (
        <div className="modal-overlay" onClick={() => setIsIssueBookModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Issue Book: {selectedBookForIssue.title}</h2>
              <button className="modal-close-btn" onClick={() => setIsIssueBookModalOpen(false)}>
                ✕
              </button>
            </div>
            
            <form className="add-book-form" onSubmit={handleIssueBook}>
              <div className="form-group">
                <label>Book Title</label>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  {selectedBookForIssue.title}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="memberName">Member Name *</label>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  placeholder="Enter member name"
                  value={issueFormData.memberName}
                  onChange={handleIssueFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentId">Student ID *</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  placeholder="Enter student ID"
                  value={issueFormData.studentId}
                  onChange={handleIssueFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issueDate">Issue Date</label>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={issueFormData.issueDate}
                    onChange={handleIssueFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={issueFormData.dueDate}
                    onChange={handleIssueFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsIssueBookModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '⏳ Issuing...' : '📤 Issue Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;