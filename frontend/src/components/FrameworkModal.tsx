import React, { useState, useEffect } from 'react';

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

interface FrameworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (framework: Framework) => void;
    editingFramework?: Framework | null;
    error?: string;
}

const FrameworkModal: React.FC<FrameworkModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingFramework,
    error
}) => {
    const [formData, setFormData] = useState<Framework>({
        title: '',
        acronym: '',
        topics: [{ letter: '', topic: '' }],
        color: 'from-blue-500 to-purple-500'
    });

    const colorOptions = [
        { value: 'from-blue-500 to-purple-500', label: 'Blue to Purple' },
        { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
        { value: 'from-green-500 to-teal-500', label: 'Green to Teal' },
        { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
        { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
        { value: 'from-indigo-500 to-blue-500', label: 'Indigo to Blue' },
        { value: 'from-red-500 to-pink-500', label: 'Red to Pink' },
        { value: 'from-teal-500 to-cyan-500', label: 'Teal to Cyan' }
    ];

    // Reset form when modal opens/closes or when editing framework changes
    useEffect(() => {
        if (isOpen) {
            if (editingFramework) {
                setFormData({
                    _id: editingFramework._id,
                    title: editingFramework.title,
                    acronym: editingFramework.acronym,
                    topics: [...editingFramework.topics],
                    color: editingFramework.color
                });
            } else {
                setFormData({
                    title: '',
                    acronym: '',
                    topics: [{ letter: '', topic: '' }],
                    color: 'from-blue-500 to-purple-500'
                });
            }
        }
    }, [isOpen, editingFramework]);

    const handleInputChange = (field: keyof Framework, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'acronym' ? value.toUpperCase() : value
        }));
    };

    const handleTopicChange = (index: number, field: 'letter' | 'topic', value: string) => {
        setFormData(prev => ({
            ...prev,
            topics: prev.topics.map((topic, i) => 
                i === index 
                    ? { ...topic, [field]: field === 'letter' ? value.toUpperCase() : value }
                    : topic
            )
        }));
    };

    const addTopic = () => {
        if (formData.topics.length < 10) {
            setFormData(prev => ({
                ...prev,
                topics: [...prev.topics, { letter: '', topic: '' }]
            }));
        }
    };

    const removeTopic = (index: number) => {
        if (formData.topics.length > 1) {
            setFormData(prev => ({
                ...prev,
                topics: prev.topics.filter((_, i) => i !== index)
            }));
        }
    };

    const generateAcronym = () => {
        const acronym = formData.topics
            .map(topic => topic.letter)
            .filter(letter => letter.trim())
            .join('.');
        handleInputChange('acronym', acronym);
        console.log('Acronym: ', acronym);
    };

    const handleSubmit = () => {
        // Basic validation
        if (!formData.title.trim() || !formData.acronym.trim()) {
            return;
        }

        const validTopics = formData.topics.filter(topic => 
            topic.letter.trim() && topic.topic.trim()
        );

        if (validTopics.length === 0) {
            return;
        }

        onSubmit({
            ...formData,
            topics: validTopics
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                        {editingFramework ? 'Edit Framework' : 'Create New Framework'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Error display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Framework Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., Software Engineer, Product Manager"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Topics */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Framework Topics *
                            </label>
                            <button
                                type="button"
                                onClick={generateAcronym}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Generate Acronym
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.topics.map((topic, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-shrink-0">
                                        <input
                                            type="text"
                                            value={topic.letter}
                                            onChange={(e) => handleTopicChange(index, 'letter', e.target.value)}
                                            placeholder="A"
                                            maxLength={5}
                                            className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={topic.topic}
                                            onChange={(e) => handleTopicChange(index, 'topic', e.target.value)}
                                            placeholder="e.g., Academic to Professional Journey"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    {formData.topics.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {formData.topics.length < 10 && (
                            <button
                                type="button"
                                onClick={addTopic}
                                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add Topic
                            </button>
                        )}
                    </div>

                    {/* Acronym */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Acronym *
                        </label>
                        <input
                            type="text"
                            value={formData.acronym}
                            onChange={(e) => handleInputChange('acronym', e.target.value)}
                            placeholder="e.g., A.S.F.M"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            This will be prominently displayed on your framework card
                        </p>
                    </div>

                    Color Selection
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Theme
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {colorOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleInputChange('color', option.value)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                        formData.color === option.value 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${option.value}`}></div>
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Preview */}
                    {formData.title && formData.acronym && (
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${formData.color} mb-2`}>
                                        <span className="text-lg font-bold text-white">
                                            {formData.acronym.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="font-bold text-gray-800">{formData.title}</div>
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${formData.color} bg-clip-text text-transparent tracking-wide`}>
                                        {formData.acronym}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all duration-300 font-semibold"
                        >
                            {editingFramework ? 'Update Framework' : 'Create Framework'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrameworkModal;