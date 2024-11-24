import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Loader2 } from 'lucide-react';

// Global styles for dynamic button and animations
const globalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff; }
    50% { box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff; }
    100% { box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff; }
  }

  @keyframes pulse {
    0% { opacity: 0.4; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes glow-aibutton {
    0% {
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 255, 255, 1);
    }
    100% {
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
    }
  }

  .ai-button {
    position: relative;
    background: linear-gradient(
      45deg,
      rgba(0, 17, 34, 0.95),
      rgba(0, 28, 56, 0.95)
    );
    border: 3px solid rgba(0, 255, 255, 0.3);
    overflow: hidden;
    animation: glow-aibutton 4s infinite;
    transition: all 0.3s ease-in-out;
  }

  .ai-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
    transition: all 0.3s ease-in-out;
  }

  .ai-button::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0, 255, 255, 0.5);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .ai-button:hover::after {
    opacity: 1;
    inset: -3px;
  }

  .ai-button .glow {
    position: absolute;
    inset: 0;
    animation: glow 2s infinite;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .ai-button:hover .glow {
    opacity: 1;
  }

  .ai-button .content {
    position: relative;
    z-index: 1;
    background: linear-gradient(90deg, #00ffff, #0099ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2;
    transition: all 0.3s ease-in-out;
  }

  .loading-button {
    background: linear-gradient(45deg, 
      rgba(0, 17, 34, 0.9),
      rgba(0, 28, 56, 0.9)
    );
    animation: pulse 2s infinite;
    transition: all 0.3s ease-in-out;
  }

  .circuit-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 10px 10px, rgba(0, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 30px 30px, rgba(0, 255, 255, 0.1) 2px, transparent 2px);
    background-size: 40px 40px;
    opacity: 0.5;
    transition: all 0.3s ease-in-out;
  }

  .slide-in {
    animation: slideIn 0.5s ease-out forwards;
    transition: all 0.3s ease-in-out;
  }

  * {
    transition: all 0.3s ease-in-out;
  }
`;

const AIButton = ({ isLoading, onClick, disabled, type }) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    onClick={onClick}
    className={`
      w-full px-6 py-4 rounded-lg font-semibold
      transform transition-all duration-300
      ${isLoading ? 'loading-button' : 'ai-button hover:scale-102'}
      relative
    `}
  >
    <div className="glow" />
    <div className="circuit-pattern" />
    <div className="content text-lg font-bold tracking-wide flex items-center justify-center gap-3">
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="ml-2">Initializing AI Resume Builder...</span>
        </>
      ) : (
        <>
          <span>Initialize AI Resume Builder</span>
          <Rocket className="w-6 h-6 animate-pulse text-cyan-400" />
        </>
      )}
    </div>
  </button>
);

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
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

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

  // Template definitions remain the same...
  const templates = {
    classic: {
      name: "Classic",
      render: (content) => (
        <div className="p-8">
          {/* Classic template content remains the same... */}
        </div>
      )
    },
    modern: {
      name: "Modern",
      render: (content) => (
        <div className="flex h-full">
          {/* Modern template content remains the same... */}
        </div>
      )
    }
  };

  if (step === 1) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#001122]">
        <style>{globalStyles}</style>
        <Card className="w-full max-w-md p-8 bg-gradient-to-b from-[#001122] to-[#002244] border border-cyan-500/30 slide-in">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <form onSubmit={handleInitialSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg text-cyan-100">
                What's your name?
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 h-12 text-lg bg-[#001122] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position" className="text-lg text-cyan-100">
                What position are you applying for?
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="mt-1 h-12 text-lg bg-[#001122] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-700"
                required
                disabled={isLoading}
              />
            </div>

            <AIButton
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full gap-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <style>{globalStyles}</style>
      {/* Input Form */}
      <Card className="w-1/2 p-8 overflow-y-auto shadow-xl slide-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Resume Information
          </h2>
          
          <Label className="text-lg mb-2">Template Style</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-full h-12 text-lg">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([key, template]) => (
                <SelectItem key={key} value={key} className="text-lg">
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-8">
          <div>
            <Label htmlFor="email" className="text-lg">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-2 h-12 text-lg"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-lg">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
              className="mt-2 h-12 text-lg"
            />
          </div>

          <div>
            <Label htmlFor="education" className="text-lg">Education</Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="BS in Computer Science&#10;University of Example&#10;GPA: 3.95/4.0"
              className="mt-2 h-36 font-mono text-lg"
            />
          </div>

          <div>
            <Label htmlFor="experience" className="text-lg">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Software Engineer, Example Corp&#10;- Developed full-stack applications using React and Node.js&#10;- Led team of 3 developers on critical projects"
              className="mt-2 h-36 font-mono text-lg"
            />
          </div>

          <div>
            <Label htmlFor="skills" className="text-lg">Skills</Label>
            <Textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Languages: Python, JavaScript, Java&#10;Technologies: React, Node.js, Docker, AWS&#10;Soft Skills: Team Leadership, Project Management"
              className="mt-2 h-36 font-mono text-lg"
            />
          </div>
        </div>
      </Card>

      {/* Preview */}
      <div className="w-1/2 flex items-start justify-center">
        <Card className="w-[8.5in] min-h-[11in] bg-white shadow-xl overflow-hidden slide-in">
          {templates[selectedTemplate].render(formData)}
        </Card>
      </div>
    </div>
  );
};

export default ResumeBuilder;