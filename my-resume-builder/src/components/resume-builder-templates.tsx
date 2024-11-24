import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Loader2 } from 'lucide-react';

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
  });

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setStep(2);
  };

  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Template-specific rendering functions
  const templates = {
    classic: {
      name: "Classic",
      render: (content) => (
        <div className="p-8">
          {/* Header */}
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

          {/* Sections */}
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
    },
    // ... other templates remain the same ...
    modern: {
      name: "Modern",
      render: (content) => (
        <div className="flex h-full">
          <div className="w-1/3 bg-gray-100 p-6 space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {content.name || 'Your Name'}
              </h1>
              <h2 className="text-lg text-gray-600 mb-2">
                {content.position || 'Desired Position'}
              </h2>
              <div className="text-sm">
                {content.email && <div>{content.email}</div>}
                {content.phone && <div>{content.phone}</div>}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-700">Skills</h2>
              <div className="text-sm whitespace-pre-line">
                {content.skills || 'Your technical skills...'}
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-2">Experience</h2>
              <div className="whitespace-pre-line">
                {content.experience || 'Your work experience...'}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-2">Education</h2>
              <div className="whitespace-pre-line">
                {content.education || 'Your education history...'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    // ... other templates remain the same but add position field to their render functions ...
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Resume Information</h2>
          
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
        <Card className="w-[8.5in] min-h-[11in] bg-white shadow-lg overflow-hidden">
          {templates[selectedTemplate].render(formData)}
        </Card>
      </div>
    </div>
  );
};

export default ResumeBuilder;