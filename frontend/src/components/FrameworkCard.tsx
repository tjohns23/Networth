import React from 'react';

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
}

interface FrameworkCardProps {
    framework: Framework;
    onEdit: (framework: Framework) => void;
    onDelete: (frameworkId: string) => void;
}

const FrameworkCard: React.FC<FrameworkCardProps> = ({
    framework,
    onEdit,
    onDelete
}) => {

    // Add this debug line
    console.log('Framework in card:', framework);
    console.log('Acronym value:', framework.acronym);
    console.log('Color value:', framework.color);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(framework);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete ${framework.title} framework?`)) {
            onDelete(framework._id!);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group cursor-pointer relative">
            {/* Edit and Delete buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={handleEdit}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600"
                    aria-label={`Edit ${framework.title}`}
                >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                    aria-label={`Delete ${framework.title}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${framework.color} mb-4`}>
                    <span className="text-2xl font-bold text-white">
                        {framework.acronym.charAt(0)}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {framework.title}
                </h3>
                <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full mx-auto"></div>
            </div>

            {/* Acronym Display */}
            <div className="text-center mb-6">
                <div className={`text-3xl font-bold bg-gradient-to-r ${framework.color || 'from-gray-600 to-gray-800'} bg-clip-text text-transparent tracking-wider`}>
                    {framework.acronym}
                </div>
            </div>

            {/* Topics Breakdown */}
            <div className="space-y-3">
                {framework.topics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${framework.color || 'from-gray-600 to-gray-800'} rounded-lg flex items-center justify-center flex-shrink-0 opacity-80`}>
                            <span className="text-sm font-bold text-white">{topic.letter}</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                {topic.topic}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hover indicator */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default FrameworkCard;