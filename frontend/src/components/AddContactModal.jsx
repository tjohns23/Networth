import React, { useState, useEffect } from "react";


export default function AddContactModal({ isOpen, onClose, onAdd }) {
    const [company, setCompany] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [numMeetings, setNumMeetings] = useState(0);
    const [lastMet, setLastMet] = useState('');

    useEffect(() => {
        if(isOpen) {
            setCompany('');
            setName('');
            setRole('');
            setEmail('');
            setNumMeetings(0);
            setLastMet('');
        }
    }, [isOpen]);

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
            numMeetings: numMeetings.trim() || 0,
            lastMet: lastMet || null,
        };

        onAdd(newContact);
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
        <h3 className="text-lg font-medium mb-4">Add Contact</h3>

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
                onChange={(e) => setNumMeetings(e.target.value)}
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

