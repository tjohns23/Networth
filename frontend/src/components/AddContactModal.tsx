import React, { useState, useEffect } from "react";

interface Contact {
    _id?: string;
    company: string;
    name: string;
    role: string;
    email: string;
    numMeetings: number;
    lastMet?: string;
}

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (contact: Contact) => void;
    onEdit: (contact: Contact) => void;
    editingContact?: Contact | null;
}

export default function AddContactModal({ isOpen, onClose, onAdd, onEdit, editingContact}: AddContactModalProps) {
    const [company, setCompany] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [numMeetings, setNumMeetings] = useState(0);
    const [lastMet, setLastMet] = useState('');

    useEffect(() => {
        if(isOpen) {
            if(editingContact) {
                console.log('Editing contact:', editingContact); // Debug log
                setCompany(editingContact.company || '');
                setName(editingContact.name || '');
                setRole(editingContact.role || '');
                setEmail(editingContact.email || '');
                // Fix: Remove duplicate condition
                const meetings = editingContact.numMeetings || 0;
                console.log('Setting numMeetings to:', meetings); // Debug log
                setNumMeetings(meetings);
                // Handle date formatting for date input
                setLastMet(editingContact.lastMet?.split('T')[0] ?? '');
            } else {
                // Reset form for new contact
                setCompany('');
                setName('');
                setRole('');
                setEmail('');
                setNumMeetings(0);
                setLastMet('');
            }
        }
    }, [isOpen, editingContact]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            alert('Please provide a name and an email');
            return;
        }

        const newContact = {
            company: company.trim() || '-',
            name: name.trim(),
            role: role.trim() || '-',
            email: email.trim() || '-',
            numMeetings: numMeetings,
            lastMet: lastMet || undefined,
        };

        console.log('Submitting contact:', newContact); // Debug log

        if (editingContact && editingContact._id) {
            onEdit({ ...newContact, _id: editingContact._id });
        } else {
            onAdd(newContact);
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop — clicking it will close modal */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 z-10"
            >
                <h3 className="text-lg font-medium mb-4">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>

                <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                        Company
                        <input
                            value={company}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Name *
                        <input
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Role
                        <input
                            value={role}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Email *
                        <input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <div className="flex gap-3">
                        <label className="text-sm flex-1">
                            Meetings
                            <input
                                type="number"
                                min="0"
                                value={numMeetings}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value;
                                    // Allow empty string (for backspacing) or valid numbers
                                    if (value === '') {
                                        setNumMeetings(0);
                                    } else {
                                        setNumMeetings(parseInt(value, 10) || 0);
                                    }
                                }}
                                onBlur={(e) => {
                                    // Convert empty string to 0 when user leaves the field
                                    if (e.target.value === '') {
                                        setNumMeetings(0);
                                    }
                                }}
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </label>

                        <label className="text-sm flex-1">
                            Last Met
                            <input
                                type="date"
                                value={lastMet}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastMet(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">
                        {editingContact ? 'Update Contact' : 'Add Contact'}
                    </button>
                </div>
            </form>
        </div>
    );
}