import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

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

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
  });

  const resumeRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('classic');

  // Modified print handler
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${formData.name.replace(/\s+/g, '_')}_Resume`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        resolve();
      });
    },
    onPrintError: (error) => console.error('Print failed:', error),
  });

  const handleExport = () => {
    handlePrint();
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const templates: Record<TemplateStyle, Template> = {
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

  if (step === 1) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Resume Builder</h1>
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="position">What position are you applying for?</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="mt-1"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-full font-semibold text-white 
                       bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500
                       transform transition-all duration-200
                       flex items-center justify-center gap-2
                       ${!isLoading && 'hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 hover:scale-105 hover:shadow-lg'}
                       ${isLoading && 'opacity-90 cursor-not-allowed'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing Your Resume Builder...</span>
                </>
              ) : (
                <>
                  Continue to Resume Builder
                  <Rocket className="w-5 h-5 animate-bounce" />
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full gap-4 p-4 bg-gray-100">
      {/* Input Form */}
      <Card className="w-1/2 p-6 overflow-y-auto">
        {/* ... rest of your form code ... */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Resume Information</h2>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Label className="mb-2">Template Style</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-6">
          {/* Form fields remain the same */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="BS in Computer Science&#10;University of Example&#10;GPA: 3.95/4.0"
              className="mt-1 h-32 font-mono"
            />
          </div>

          <div>
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Software Engineer, Example Corp&#10;- Developed full-stack applications using React and Node.js&#10;- Led team of 3 developers on critical projects"
              className="mt-1 h-32 font-mono"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Languages: Python, JavaScript, Java&#10;Technologies: React, Node.js, Docker, AWS&#10;Soft Skills: Team Leadership, Project Management"
              className="mt-1 h-32 font-mono"
            />
          </div>
        </div>
      </Card>

      {/* Preview */}
      <div className="w-1/2 flex items-start justify-center">
        <div ref={resumeRef} className="w-[8.5in] min-h-[11in]">
          <Card className="bg-white shadow-lg">
            <div className="h-full">
              {templates[selectedTemplate].render(formData)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default ResumeBuilder;