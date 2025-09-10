import { useState, useEffect } from 'react'
import './App.css'
import ContactCard from './components/ContactCard'
import AddContactModal from './components/AddContactModal'
import Login from './components/Login'
import FrameworkModal from './components/FrameworkModal';
import FrameworkCard from './components/FrameworkCard';

interface Contact {
  _id?: string;
  company: string;
  name: string;
  role: string;
  email: string;
  numMeetings: number;
  lastMet?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface FrameworkTopic {
    letter: string;
    topic: string;
}

interface Framework {
    _id?: string;
    title: string;
    acronym: string;
    topics: FrameworkTopic[];
    color: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

function App() {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Existing state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('contacts');

    // Frameworks
    const [frameworks, setFrameworks] = useState<Framework[]>([])
    const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
    const [editingFramework, setIsEditingFramework] = useState<Framework | null>(null);
    const [frameworkError, setFrameworkError] = useState("");
    const [frameworksLoading, setFrameworksLoading] = useState(true);

    // Check for existing token on app load
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        } else {
            setLoading(false); // Stop loading if no saved auth
        }
    }, []);

    useEffect(() => {
        if (activeSection === 'contacts' && isAuthenticated) {
            fetchContacts();
            fetchFrameworks();
        }
    }, [activeSection, isAuthenticated]);

    // Authentication handlers
    const handleLoginSuccess = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setContacts([]); // Clear contacts on logout
        setActiveSection('contacts'); // Reset to contacts view
    };

    // API helper function to include auth header
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const authHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        return fetch(url, {
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
        });
    };

    // Contacts
    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchWithAuth("/api/contacts");
            
            if (!res.ok) {
                if (res.status === 401) {
                    // Token expired or invalid, logout user
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setError("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    const addContact = async (newContact: Contact) => {
        try {
            const res = await fetchWithAuth("/api/contacts", {
                method: "POST",
                body: JSON.stringify(newContact)
            });

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // Refresh contacts list
            await fetchContacts();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding contact:", error);
            setError("Failed to add contact");
        }
    };

    const editContact = async (updatedContact: Contact) => {
        try {
            const id = updatedContact._id;
            const response = await fetchWithAuth(`/api/contacts/${id}`, {
                method: "PUT",
                body: JSON.stringify(updatedContact)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status : ${response.status}`);
            }

            await fetchContacts();
            setEditingContact(null);
        } catch (error) {
            console.error("Error editing contact: ", error);
            setError("Failed to edit contact");
        }
    };
    
    const deleteContact = async (id: string) => {
        try {
            console.log('Deleting contact with id: ', id);
            const response = await fetchWithAuth(`/api/contacts/${id}`, { 
                method: "DELETE" 
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh contacts list
            await fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            setError("Failed to delete contact");
        }
    };


    // Frameworks
    const fetchFrameworks = async () => {
        try {
            setFrameworksLoading(true);
            setFrameworkError("");

            const res = await fetchWithAuth("/api/frameworks", {
                method: "GET"
            });

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setFrameworks(data);
        } catch (error) {
            console.error("Error fetching frameworks: ", error);
            setFrameworkError("Failed to load frameworks");
        } finally {
            setFrameworksLoading(false);
        }
    };

    const addFrameworks = async (newFramework: Framework) => {
        try {
            setFrameworkError("");

            const res = await fetchWithAuth("/api/frameworks", {
                method: "POST",
                body: JSON.stringify(newFramework)
            });

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    return
                }
                throw new Error (`HTTP error! status: ${res.status}`)
            }

            await fetchFrameworks();
            setIsFrameworkModalOpen(false);

            console.log("Framework added successfully!")
        } catch (error) {
            console.error("Error adding framework: ", error);
            setFrameworkError("Failed to add framework");
        }
    };

    const editFramework = async (updatedFramework: Framework) => {
        try {
            setFrameworkError("");

            const id = updatedFramework._id;
            // rememeber why we put id here again
            console.log('Calling edit api route from frontend');
            const response = await fetchWithAuth(`/api/frameworks/${id}`, {
                method: "PUT",
                body: JSON.stringify(updatedFramework)
            });
            console.log('Got response');

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchFrameworks();
            setIsEditingFramework(null);

            console.log("Framework updated successfully");
        } catch (error) {
            console.error("Error editing framework: ", error);
            setFrameworkError("Failed to edit framework");
        }
    }

    const deleteFramework = async (frameworkId: string) => {
        try {
            setFrameworkError("");

            const response = await fetchWithAuth(`/api/frameworks/${frameworkId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchFrameworks();

            console.log("Framework deleted successfully");
        } catch (error) {
            console.error("Error deleting framework:", error);
            setFrameworkError("Failed to delete framework");
        }
    }

    const renderDashboard = () => (
        <div className="text-center py-16">
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                <p className="text-gray-600">Analytics and insights coming soon...</p>
                <div className="mt-6 h-2 bg-gradient-to-r from-orange-200 to-blue-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    const renderFrameworkTemplates = () => {
        console.log('Framework data: ', frameworks)
        const handleEditFramework = (framework: Framework) => {
            setIsEditingFramework(framework);
            setIsFrameworkModalOpen(true);
        };

        return (
            <div className="flex gap-6 p-6 min-h-screen">
                {/* Main content area - Framework cards */}
                <div className="flex-1">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            Coffee Chat Frameworks
                        </h2>
                        <p className="text-gray-600">Structured conversation starters for meaningful discussions</p>
                    </div>

                    {/* Error handling */}
                    {frameworkError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-700">{frameworkError}</p>
                        </div>
                    )}

                    {/* Loading state */}
                    {frameworksLoading ? (
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-12 max-w-md mx-auto">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Frameworks...</h3>
                                <div className="mt-4 h-2 bg-gradient-to-r from-blue-200 to-orange-200 rounded-full">
                                    <div className="h-2 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full w-2/3 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : frameworks.length === 0 ? (
                        /* Empty state */
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-12 max-w-md mx-auto">
                                <div className="text-6xl mb-4">💡</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Frameworks Yet</h3>
                                <p className="text-gray-600 mb-6">Create your first coffee chat framework to get started!</p>
                                <button 
                                    onClick={() => setIsFrameworkModalOpen(true)}
                                    className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                >
                                    Create Your First Framework
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Framework cards grid */
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {frameworks.map((framework) => (
                                    <FrameworkCard
                                        key={framework._id}
                                        framework={framework}
                                        onEdit={handleEditFramework}
                                        onDelete={deleteFramework}
                                    />
                                ))}
                            </div>

                            {/* Add New Framework Button */}
                            <div className="text-center">
                                <button 
                                    onClick={() => setIsFrameworkModalOpen(true)}
                                    className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                                >
                                    + Create New Framework
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Right sidebar - Upcoming meetings placeholder */}
                <div className="w-80 flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg rounded-2xl p-6 sticky top-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                Upcoming Meetings
                            </h3>
                            <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full mx-auto"></div>
                        </div>

                        {/* Placeholder content */}
                        <div className="space-y-4">
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">📅</div>
                                <p className="text-gray-500 text-sm">Meeting integration coming soon...</p>
                            </div>
                            
                            {/* Example upcoming meeting items */}
                            <div className="space-y-3 opacity-30">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Coffee with Sarah</p>
                                        <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Team Sync</p>
                                        <p className="text-xs text-gray-500">Friday, 10:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContacts = () => {
        if (loading) {
            return (
                <div className="text-center py-16">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4">
                        <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-700 font-medium">Loading contacts...</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Contacts</h2>
                        <p className="text-gray-600 mt-1">Manage your professional network</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">+</span>
                            Add Contact
                        </span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
                        <div className="text-xl">⚠️</div>
                        <div>{error}</div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {contacts.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-md mx-auto">
                                <div className="text-6xl mb-4">👋</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No contacts yet</h3>
                                <p className="text-gray-600 mb-6">Start building your network by adding your first contact</p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-blue-400 text-white font-medium hover:from-orange-500 hover:to-blue-500 transition-all duration-200"
                                >
                                    Add First Contact
                                </button>
                            </div>
                        </div>
                    ) : (
                        contacts.map((contact) => (
                            <ContactCard
                                key={contact._id || contact._id}
                                contact={contact}
                                onDelete={deleteContact}
                                onEdit={setEditingContact}
                            />
                        ))
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboard();
            case 'framework-templates':
                return renderFrameworkTemplates();
            case 'contacts':
            default:
                return renderContacts();
        }
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen w-full bg-orange-50">
            {/* Navigation */}
            <nav className="p-6 pb-0">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                            Networth
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                                { id: 'resume-cover-suite', label: 'Resume & Cover Letters', icon: '📁' },
                                { id: 'contacts', label: 'Contacts', icon: '👥' },
                                { id: 'framework-templates', label: 'Frameworks', icon: '🏗️' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                        activeSection === item.id
                                            ? 'bg-gradient-to-r from-orange-400 to-blue-400 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                    }`}
                                >
                                    <span className="text-sm">{item.icon}</span>
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* User menu */}
                        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user?.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="text-sm">
                                <div className="font-medium text-gray-800">{user?.name}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6 flex-1">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Modal */}
            <AddContactModal
                isOpen={isModalOpen || editingContact !== null}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingContact(null);
                }}
                onAdd={addContact}
                onEdit={editContact}
                editingContact={editingContact}
            />
            <FrameworkModal
                isOpen={isFrameworkModalOpen}
                onClose={() => {
                    setIsFrameworkModalOpen(false);
                    setIsEditingFramework(null);
                }}
                onSubmit={editingFramework ? editFramework : addFrameworks}
                editingFramework={editingFramework}
                error={frameworkError}
            />
        </div>
    );
}

export default App