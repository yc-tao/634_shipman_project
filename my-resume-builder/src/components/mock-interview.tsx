// src/components/mock-interview.tsx

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  MessageSquare, 
  Clock,
  ArrowRight,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface MockInterviewProps {
  onBack: () => void;
  resumeData: {
    name: string;
    position: string;
    education: string;
    experience: string;
    skills: string;
  };
}

interface Question {
  id: string;
  text: string;
  category: string;
  keyPoints: string[];
}

const MockInterview: React.FC<MockInterviewProps> = ({ onBack, resumeData }) => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // 2 minutes per question
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestions = () => {
    const questions: Question[] = [
      // Experience-based questions
      {
        id: '1',
        text: `Can you tell me about your role as a ${resumeData.position}?`,
        category: 'experience',
        keyPoints: ['Key responsibilities', 'Achievements', 'Challenges overcome']
      },
      {
        id: '2',
        text: 'Describe a challenging project you worked on recently.',
        category: 'experience',
        keyPoints: ['Project context', 'Your role', 'Outcome', 'Lessons learned']
      },
      
      // Technical/Skills questions
      ...resumeData.skills.split(',').slice(0, 3).map((skill, index) => ({
        id: `skill-${index}`,
        text: `Can you describe a project where you used ${skill.trim()}?`,
        category: 'technical',
        keyPoints: ['Project overview', 'Technical details', 'Your contribution', 'Results']
      })),
      
      // Behavioral questions
      {
        id: '3',
        text: 'How do you handle disagreements with team members?',
        category: 'behavioral',
        keyPoints: ['Specific example', 'Your approach', 'Resolution', 'Learning outcome']
      },
      {
        id: '4',
        text: 'Tell me about a time you had to learn a new technology quickly.',
        category: 'behavioral',
        keyPoints: ['Situation context', 'Your approach', 'Results', 'What you learned']
      },
      
      // Education-based questions
      {
        id: '5',
        text: `How has your education in ${resumeData.education.split('\n')[0]} prepared you for this role?`,
        category: 'education',
        keyPoints: ['Relevant coursework', 'Projects', 'Skills gained']
      }
    ];

    setQuestions(questions);
  };

  const startInterview = () => {
    generateQuestions();
    setIsInterviewStarted(true);
    startTimer();
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateFeedback = async (answer: string, question: Question) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer,
          question: question.text,
          keyPoints: question.keyPoints,
          position: resumeData.position
        }),
      });

      if (!response.ok) throw new Error('Failed to generate feedback');
      const data = await response.json();
      return data.feedback;
    } catch (error) {
      console.error('Error:', error);
      // Fallback to basic feedback if API fails
      return `🔍 Review your answer for these key points:\n- ${question.keyPoints.join('\n- ')}\n\n🌟 Remember the STAR method:\n- Situation\n- Task\n- Action\n- Result`;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!answer.trim()) {
      setFeedback('Please provide an answer before continuing.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const newFeedback = await generateFeedback(answer, currentQuestion);
    setFeedback(newFeedback);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setTimeRemaining(120);
      startTimer();
    }
  };

  const resetInterview = () => {
    setIsInterviewStarted(false);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback('');
    setTimeRemaining(120);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resume
        </Button>

        {!isInterviewStarted ? (
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mock Interview Setup</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Welcome, {resumeData.name}!</h2>
                <p className="text-gray-600">
                  Prepare for your {resumeData.position} interview. We'll generate questions
                  based on your resume and provide real-time feedback.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Focus Area
                </label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={startInterview}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Progress and Timer */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </div>
              <Progress value={(currentQuestionIndex + 1) / questions.length * 100} />
            </Card>

            {/* Question and Answer Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {questions[currentQuestionIndex]?.text}
                  </h2>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={resetInterview}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Feedback Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                </h2>
                {feedback ? (
                  <div className="whitespace-pre-line text-gray-700">
                    {feedback}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    {isLoading ? 'Analyzing your response...' : 'Complete your answer to receive feedback...'}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;