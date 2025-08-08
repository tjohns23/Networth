import { useState } from 'react'
import './App.css'
import ContactCard from './components/ContactCard'
import AddContactModal from './components/AddContactModal'

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Contact list
    const [contacts, setContacts] = useState([]);

    const addContact = (contact) => {
        // Create a simple unique id
        const id = Date.now() + Math.floor(Math.random() * 1000);

        setContacts((prev => [{id, ...contact}, ...prev]));
    };
    
    const removeContact = (idToRemove) => {
        setContacts((prev) => prev.filter((c) => c.id !== idToRemove));
    };

  return (
    <>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Contacts</h1>
                <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white ml-4"
                >
                    + Add Contact
                </button>
            </header>


            <main className="flex">
                {contacts.length === 0 ? (
                    <p className="text-center text-gray-500">No Contacts Yet</p>
                ) : (
                    contacts.map((contact) => (
                        <ContactCard
                        key={contact.id}
                        contact={contact}
                        onDelete={removeContact}
                        />
                    ))
                )}
            </main>
        </div>
            <AddContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={addContact}
            />

      </div>
    </>
  );
}

export default App
