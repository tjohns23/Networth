import React from 'react';

export default function ContactCard({ contact, onDelete }) {
  const { id, company, name, role, email, numMeetings, lastMet } = contact;

  return (
    <div className="bg-white shadow-md rounded-2xl px-6 py-4 w-full max-w-md mx-auto text-left mb-4 flex items-start justify-between">
      <div>
        <h2 className="text-lg font-semibold">{company}</h2>
        <p className="text-sm"><span className="font-medium">Name:</span> {name}</p>
        <p className="text-sm"><span className="font-medium">Role:</span> {role}</p>
        <p className="text-sm"><span className="font-medium">Email:</span> {email}</p>
        <p className="text-sm"><span className="font-medium">Meetings:</span> {numMeetings}</p>
        <p className="text-sm"><span className="font-medium">Last Met:</span> {lastMet}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => {
            if (confirm(`Delete ${name}?`)) onDelete(id);
          }}
          className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
          aria-label={`Delete ${name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
