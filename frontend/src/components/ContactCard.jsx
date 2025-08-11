import React from 'react';

export default function ContactCard({ contact, onDelete, onEdit }) {
  const { _id, company, name, role, email, numMeetings, lastMet } = contact;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl rounded-2xl p-6 w-full text-left transition-all duration-300 hover:-translate-y-1 group">
      {/* Header with company and action button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {company}
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full"></div>
        </div>
        
        <button
          onClick={() => onEdit(contact)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600"
          aria-label={`Edit ${name}`}
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button
          onClick={() => {
            console.log('Deleting contact with _id:', _id);
            if (confirm(`Delete ${name}?`)) onDelete(_id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 ml-3"
          aria-label={`Delete ${name}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">👤</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">📧</span>
          </div>
          <p className="text-sm text-gray-700 break-all">{email}</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              {numMeetings || 0}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Meetings</div>
          </div>
          
          <div className="h-8 w-px bg-gray-200"></div>
          
          <div className="text-center flex-1 ml-4">
            <div className="text-sm font-medium text-gray-700">
              {lastMet ? new Date(lastMet).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              }) : 'Never'}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Last Met</div>
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}