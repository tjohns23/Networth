import React, { useState, useEffect } from "react";

export default function AddContactModal({ isOpen, onClose, onAdd, onEdit, editingContact}) {
    const [company, setCompany] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [numMeetings, setNumMeetings] = useState(0);
    const [lastMet, setLastMet] = useState('');

    useEffect(() => {
        if(editingContact) {
            console.log('Editing contact:', editingContact); // Debug log
            setCompany(editingContact.company || '');
            setName(editingContact.name || '');
            setRole(editingContact.role || '');
            setEmail(editingContact.email || '');
            // Ensure numMeetings is properly set as a number
            const meetings = editingContact.numMeetings || editingContact.meetings || 0;
            console.log('Setting numMeetings to:', meetings); // Debug log
            setNumMeetings(meetings);
            // Handle date formatting for date input
            setLastMet(editingContact.lastMet ? editingContact.lastMet.split('T')[0] : '');
        } else {
            setCompany('');
            setName('');
            setRole('');
            setEmail('');
            setNumMeetings(0);
            setLastMet('');
        }
    }, [editingContact]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
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
            numMeetings: parseInt(numMeetings) || 0, // This will handle empty string as 0
            lastMet: lastMet || null,
        };

        console.log('Submitting contact:', newContact); // Debug log

        if (editingContact) {
            onEdit(editingContact._id, newContact);
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
                {/* Fixed typo: was 'COntact', should be 'Contact' */}
                <h3 className="text-lg font-medium mb-4">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>

                <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                        Company
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Name *
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Role
                        <input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </label>

                    <label className="text-sm">
                        Email *
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow empty string (for backspacing) or valid numbers
                                    if (value === '') {
                                        setNumMeetings('');
                                    } else {
                                        setNumMeetings(parseInt(value) || 0);
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
                                onChange={(e) => setLastMet(e.target.value)}
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