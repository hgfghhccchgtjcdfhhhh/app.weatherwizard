import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookOpen, X, FileText } from 'lucide-react';

const ReadmeComponent: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchReadmeContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/README.md');
      if (response.ok) {
        const content = await response.text();
        setReadmeContent(content);
      } else {
        toast.error('Failed to load README content');
      }
    } catch (error) {
      toast.error('Error loading README file');
      console.error('Error fetching README:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!isPopupOpen) {
      fetchReadmeContent();
    }
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Convert markdown to basic HTML for better display
  const formatMarkdownContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-gray-800">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-gray-700">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 text-gray-600">$1</h3>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([^```]+)```/gim, '<pre class="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm font-mono mb-4"><code>$1</code></pre>')
      .replace(/\n\n/gim, '</p><p class="mb-3">')
      .replace(/\n/gim, '<br>');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleButtonClick}
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
          title="View README"
        >
          <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
        </button>
      </div>

      {/* Backdrop */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
          onClick={handleClosePopup}
        />
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-16 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-semibold">README Documentation</h2>
            </div>
            <button
              onClick={handleClosePopup}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading README...</span>
              </div>
            ) : readmeContent ? (
              <div className="prose prose-sm md:prose-base max-w-none">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-3">${formatMarkdownContent(readmeContent)}</p>`
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No README content available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadmeComponent;