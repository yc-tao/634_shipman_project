import React from 'react';

interface FormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
}

type TemplateStyle = 'professional' | 'minimal' | 'creative' | 'classic';

interface Template {
  name: string;
  render: (content: FormData) => React.ReactNode;
}

// Extracted templates into a separate component
export const resumeTemplates: Record<TemplateStyle, Template> = {
  professional: {
    name: "Professional",
    render: (content: FormData) => (
      <div className="p-8 font-sans">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content.name || 'Your Name'}</h1>
          <h2 className="text-xl text-blue-600 mb-3">{content.position || 'Desired Position'}</h2>
          <div className="flex gap-4 text-gray-600">
            {content.email && <span className="flex items-center gap-1">📧 {content.email}</span>}
            {content.phone && <span className="flex items-center gap-1">📱 {content.phone}</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-100">
                Professional Experience
              </h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {content.experience || 'Your work experience...'}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-100">
                Education
              </h2>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {content.education || 'Your education history...'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-100">
              Skills & Expertise
            </h2>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {content.skills || 'Your technical skills...'}
            </div>
          </div>
        </div>
      </div>
    )
  },
  minimal: {
    name: "Minimal",
    render: (content: FormData) => (
      <div className="p-8 font-sans bg-white text-gray-800">
        <div className="mb-12 border-l-4 border-gray-800 pl-6">
          <h1 className="text-4xl font-light mb-2">{content.name || 'Your Name'}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{content.position || 'Desired Position'}</h2>
          <div className="text-sm text-gray-500 space-y-1">
            {content.email && <div>{content.email}</div>}
            {content.phone && <div>{content.phone}</div>}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg uppercase tracking-wider mb-4 text-gray-500">Experience</h2>
            <div className="whitespace-pre-line leading-relaxed">
              {content.experience || 'Your work experience...'}
            </div>
          </div>

          <div>
            <h2 className="text-lg uppercase tracking-wider mb-4 text-gray-500">Education</h2>
            <div className="whitespace-pre-line leading-relaxed">
              {content.education || 'Your education history...'}
            </div>
          </div>

          <div>
            <h2 className="text-lg uppercase tracking-wider mb-4 text-gray-500">Skills</h2>
            <div className="whitespace-pre-line leading-relaxed">
              {content.skills || 'Your technical skills...'}
            </div>
          </div>
        </div>
      </div>
    )
  },
  creative: {
    name: "Creative",
    render: (content: FormData) => (
      <div className="h-full">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{content.name || 'Your Name'}</h1>
          <h2 className="text-2xl mb-4">{content.position || 'Desired Position'}</h2>
          <div className="flex gap-4 text-sm">
            {content.email && <div className="bg-white/20 px-4 py-1 rounded-full">{content.email}</div>}
            {content.phone && <div className="bg-white/20 px-4 py-1 rounded-full">{content.phone}</div>}
          </div>
        </div>

        <div className="p-8 grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-purple-600"></span>
                Experience
              </h2>
              <div className="whitespace-pre-line leading-relaxed">
                {content.experience || 'Your work experience...'}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-pink-600"></span>
                Education
              </h2>
              <div className="whitespace-pre-line leading-relaxed">
                {content.education || 'Your education history...'}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-gradient-to-b from-purple-50 to-pink-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-red-600"></span>
                Skills
              </h2>
              <div className="whitespace-pre-line leading-relaxed">
                {content.skills || 'Your technical skills...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  classic: {
    name: "Classic",
    render: (content: FormData) => (
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            {content.name || 'Your Name'}
          </h1>
          <h2 className="text-xl font-serif text-gray-600 mb-2">
            {content.position || 'Desired Position'}
          </h2>
          <p className="text-gray-600">
            {content.email && <span>{content.email}</span>}
            {content.email && content.phone && <span> | </span>}
            {content.phone && <span>{content.phone}</span>}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold border-b-2 border-gray-300 mb-3">
              Education
            </h2>
            <div className="whitespace-pre-line">
              {content.education || 'Your education history...'}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold border-b-2 border-gray-300 mb-3">
              Experience
            </h2>
            <div className="whitespace-pre-line">
              {content.experience || 'Your work experience...'}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold border-b-2 border-gray-300 mb-3">
              Skills
            </h2>
            <div className="whitespace-pre-line">
              {content.skills || 'Your technical skills...'}
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export type { FormData, TemplateStyle, Template };