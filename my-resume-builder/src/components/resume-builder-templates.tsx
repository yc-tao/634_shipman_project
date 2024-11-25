import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, Download, Printer, MessageSquare, Search, Sparkles, Bot } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import MockInterview from './mock-interview';
import JobSearch from './job-search';
import { resumeTemplates, type FormData, type TemplateStyle } from './resume-templates';

const ThinkingAnimation = () => (
  <div className="absolute right-0 top-0 flex items-center gap-1">
    <Bot className="w-4 h-4 text-blue-500 animate-bounce" />
    <span className="flex gap-1">
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  </div>
);

const TypingAnimation = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust typing speed here

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex]);

  return <span>{displayedText}</span>;
};

const AnimatedRecommendation = ({ template }: { template: TemplateStyle | null }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (template) {
      setShowAnimation(true);
    }
  }, [template]);

  if (!template || !showAnimation) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
        <span className="text-blue-600 font-medium">AI Recommendation</span>
      </div>
      <div className="mt-2 text-gray-700">
        <TypingAnimation text={`Based on your desired role, I recommend the ${resumeTemplates[template].name} template for optimal impact.`} />
      </div>
    </div>
  );
};

const ResumeBuilder = () => {
  // All hooks need to be declared first
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('classic');
  const [showInterview, setShowInterview] = useState(false);
  const [showJobSearch, setShowJobSearch] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [recommendedTemplate, setRecommendedTemplate] = useState<TemplateStyle | null>(null);
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

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsThinking(true);

  };

  const getRecommendedTemplate = (position: string): TemplateStyle => {
    const positionLower = position.toLowerCase();
    
    // Creative positions
    if (positionLower.includes('designer') || 
        positionLower.includes('artist') || 
        positionLower.includes('creative') ||
        positionLower.includes('ux') ||
        positionLower.includes('ui')) {
      return 'creative';
    }
    
    // Technical positions
    if (positionLower.includes('engineer') || 
        positionLower.includes('developer') || 
        positionLower.includes('programmer') ||
        positionLower.includes('technical') ||
        positionLower.includes('analyst')) {
      return 'professional';
    }
    
    // Business/Management positions
    if (positionLower.includes('manager') || 
        positionLower.includes('executive') || 
        positionLower.includes('director') ||
        positionLower.includes('lead') ||
        positionLower.includes('supervisor')) {
      return 'classic';
    }
    
    // Minimal for everything else
    return 'minimal';
  };

  useEffect(() => {
    if (formData.position) {
      const timeoutId = setTimeout(() => {
        const recommended = getRecommendedTemplate(formData.position);
        setRecommendedTemplate(recommended);
        setSelectedTemplate(recommended);
      }, 500); // Delay before showing recommendation

      return () => clearTimeout(timeoutId);
    }
  }, [formData.position]);

  // Handlers
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${formData.name.replace(/\s+/g, '_')}_Resume`,
  });

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

  const handleStartInterview = () => {
    setShowInterview(true);
  };

  const handleStartJobSearch = () => {
    setShowJobSearch(true);
  };

  const handleBackToResume = () => {
    setShowInterview(false);
    setShowJobSearch(false);
  };

  // After all hooks and handlers, we can have conditional returns
  if (showInterview) {
    return <MockInterview onBack={handleBackToResume} resumeData={formData} />;
  }

  if (showJobSearch) {
    return <JobSearch onBack={handleBackToResume} position={formData.position} skills={formData.skills} />;
  }

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
                onChange={handlePositionChange}
                placeholder="Software Engineer"
                className="mt-1"
                required
                disabled={isLoading}
              />
              <AnimatedRecommendation template={recommendedTemplate} />
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
      <Card className="w-1/2 p-6 overflow-y-auto">
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
            <Button
              onClick={handleStartJobSearch}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Button>
            <Button
              onClick={handleStartInterview}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="w-4 h-4" />
              Practice Interview
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
              {Object.entries(resumeTemplates).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {recommendedTemplate && (
            <p className="mt-2 text-sm text-blue-600">
              {resumeTemplates[recommendedTemplate].name} template is recommended based on your desired job
            </p>
          )}
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

      <div className="w-1/2 flex items-start justify-center">
        <div ref={resumeRef} className="w-[8.5in] min-h-[11in]">
          <Card className="bg-white shadow-lg">
            <div className="h-full">
              {resumeTemplates[selectedTemplate].render(formData)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;