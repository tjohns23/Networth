import { useState, useEffect } from 'react'
import './App.css'
import ContactCard from './components/ContactCard'
import AddContactModal from './components/AddContactModal'

interface Contact {
  _id?: string;
  company: string;
  name: string;
  role: string;
  email: string;
  numMeetings: number;
  lastMet?: string;
}

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('contacts');

    useEffect(() => {
        if (activeSection === 'contacts') {
            fetchContacts();
        }
    }, [activeSection]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/contacts");
            
            if (!res.ok) {
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
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newContact)
            });

            if (!res.ok) {
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
            const response = await fetch(`/api/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedContact)
            });

            if (!response.ok) {
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
            const response = await fetch(`/api/contacts/${id}`, { 
                method: "DELETE" 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh contacts list
            await fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            setError("Failed to delete contact");
        }
    };

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

    const renderEmailTemplates = () => (
        <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Templates</h2>
                <p className="text-gray-600">Template management coming soon...</p>
                <div className="mt-6 h-2 bg-gradient-to-r from-blue-200 to-orange-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full w-2/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

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
            case 'email-templates':
                return renderEmailTemplates();
            case 'contacts':
            default:
                return renderContacts();
        }
    };

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
                    
                    <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                            { id: 'contacts', label: 'Contacts', icon: '👥' },
                            { id: 'email-templates', label: 'Templates', icon: '📧' }
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
        </div>
    );
}

export default App