import React, { useState } from 'react';
import { Check, X, BarChart3, Trophy, Target, Crown } from 'lucide-react';
import { RoundFormat } from '../types';

interface Round {
  number: number;
  name: string;
  format: RoundFormat;
  questions: number;
  pointsEach: number;
  questionFormat: string;
  answers: string[];
  correct: (boolean | null)[];
  secondAnswers: string[];
  secondCorrect: (boolean | null)[];
  topFiveAnswers: string[][];
  topFiveCorrect: (boolean | null)[][];
  connectionScoring?: number[];
}

interface Theme {
  name: string;
  background: string;
  resultsBackground: string;
  accent: string;
}

const QuizScoresheet = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [quizDate, setQuizDate] = useState(new Date().toLocaleDateString());
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('colorful');

  const themes: Record<string, Theme> = {
    colorful: {
      name: 'Colorful (Default)',
      background: 'from-indigo-900 via-purple-900 to-pink-900',
      resultsBackground: 'from-purple-900 via-blue-900 to-indigo-900',
      accent: 'from-yellow-400 to-pink-500'
    },
    dark: {
      name: 'Dark Professional',
      background: 'from-gray-900 via-slate-900 to-black',
      resultsBackground: 'from-slate-900 via-gray-900 to-black',
      accent: 'from-blue-400 to-cyan-500'
    },
    ocean: {
      name: 'Ocean Blue',
      background: 'from-blue-900 via-teal-900 to-cyan-900',
      resultsBackground: 'from-teal-900 via-blue-900 to-indigo-900',
      accent: 'from-cyan-400 to-blue-500'
    },
    sunset: {
      name: 'Sunset Orange',
      background: 'from-orange-900 via-red-900 to-pink-900',
      resultsBackground: 'from-red-900 via-orange-900 to-yellow-900',
      accent: 'from-orange-400 to-red-500'
    },
    forest: {
      name: 'Forest Green',
      background: 'from-green-900 via-emerald-900 to-teal-900',
      resultsBackground: 'from-emerald-900 via-green-900 to-lime-900',
      accent: 'from-green-400 to-emerald-500'
    }
  };

  const roundFormats: Record<string, {
    questions: number;
    pointsEach: number;
    format: string;
    description: string;
  }> = {
    'General Knowledge': { questions: 10, pointsEach: 1, format: 'single', description: 'Standard single answer questions' },
    'Picture Round': { questions: 10, pointsEach: 1, format: 'single', description: 'Visual identification questions' },
    'Music Round': { questions: 10, pointsEach: 1, format: 'single', description: '1 point per question' },
    'Connections Round': { questions: 5, pointsEach: 1, format: 'connection', description: '4 questions (1pt) + connection (2pts)' },
    'True or False': { questions: 10, pointsEach: 1, format: 'single', description: 'Binary T/F questions' },
    'Multiple Choice': { questions: 10, pointsEach: 1, format: 'single', description: '3-4 options per question' },
    'Easy/Hard Round': { questions: 10, pointsEach: 1, format: 'easyhard', description: '1 point per correct part (easy/hard)' },
    'All or Nothing Round': { questions: 10, pointsEach: 1, format: 'allornothing', description: 'Must get both parts for 1 point' },
    'Top 5 Round': { questions: 2, pointsEach: 1, format: 'topfive', description: '2 questions, 5 answers each (10 total)' },
    '54321': { questions: 15, pointsEach: 1, format: 'single', description: 'Fast delivery questions' },
    'Bonus Round': { questions: 1, pointsEach: 5, format: 'single', description: 'Final high-value question' },
    'Fill in the Blank': { questions: 10, pointsEach: 1, format: 'single', description: 'Complete the missing word/phrase' },
    'Odd One Out': { questions: 10, pointsEach: 1, format: 'single', description: 'Identify the different item' },
    'What Comes Next?': { questions: 10, pointsEach: 1, format: 'single', description: 'Pattern recognition questions' }
  };

  const [rounds, setRounds] = useState<Round[]>([
    { number: 1, name: 'Round 1', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 2, name: 'Round 2', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 3, name: 'Round 3', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 4, name: 'Round 4', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 5, name: 'Round 5', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 6, name: 'Round 6', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
    { number: 7, name: 'Round 7', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) }
  ]);

  const setRoundFormat = (roundIndex: number, formatName: string) => {
    const format = roundFormats[formatName];
    const newRounds = [...rounds];
    const oldQuestions = newRounds[roundIndex].questions;

    newRounds[roundIndex].format = formatName as RoundFormat;
    newRounds[roundIndex].name = formatName;
    newRounds[roundIndex].questions = format.questions;
    newRounds[roundIndex].pointsEach = format.pointsEach;
    newRounds[roundIndex].questionFormat = format.format;

    if (format.format === 'connection') {
      newRounds[roundIndex].connectionScoring = [1, 1, 1, 1, 2];
    }

    if (format.format === 'topfive') {
      newRounds[roundIndex].topFiveAnswers = Array(2).fill(null).map(() => Array(5).fill(''));
      newRounds[roundIndex].topFiveCorrect = Array(2).fill(null).map(() => Array(5).fill(null));
    }

    if (format.questions !== oldQuestions) {
      if (format.questions > oldQuestions) {
        newRounds[roundIndex].answers = [...newRounds[roundIndex].answers, ...Array(format.questions - oldQuestions).fill('')];
        newRounds[roundIndex].correct = [...newRounds[roundIndex].correct, ...Array(format.questions - oldQuestions).fill(null)];
        newRounds[roundIndex].secondAnswers = [...newRounds[roundIndex].secondAnswers, ...Array(format.questions - oldQuestions).fill('')];
        newRounds[roundIndex].secondCorrect = [...newRounds[roundIndex].secondCorrect, ...Array(format.questions - oldQuestions).fill(null)];
      } else {
        newRounds[roundIndex].answers = newRounds[roundIndex].answers.slice(0, format.questions);
        newRounds[roundIndex].correct = newRounds[roundIndex].correct.slice(0, format.questions);
        newRounds[roundIndex].secondAnswers = newRounds[roundIndex].secondAnswers.slice(0, format.questions);
        newRounds[roundIndex].secondCorrect = newRounds[roundIndex].secondCorrect.slice(0, format.questions);
      }
    }

    setRounds(newRounds);
  };

  const updateAnswer = (roundIndex: number, questionIndex: number, answer: string) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].answers[questionIndex] = answer;
    setRounds(newRounds);
  };

  const updateSecondAnswer = (roundIndex: number, questionIndex: number, answer: string) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].secondAnswers[questionIndex] = answer;
    setRounds(newRounds);
  };

  const updateTopFiveAnswer = (roundIndex: number, questionIndex: number, answerIndex: number, answer: string) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].topFiveAnswers[questionIndex][answerIndex] = answer;
    setRounds(newRounds);
  };

  const markQuestion = (roundIndex: number, questionIndex: number, isCorrect: boolean) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].correct[questionIndex] = isCorrect;
    setRounds(newRounds);

    if (isCorrect) {
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 500);
    }
  };

  const markSecondQuestion = (roundIndex: number, questionIndex: number, isCorrect: boolean) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].secondCorrect[questionIndex] = isCorrect;
    setRounds(newRounds);
  };

  const markTopFiveAnswer = (roundIndex: number, questionIndex: number, answerIndex: number, isCorrect: boolean) => {
    const newRounds = [...rounds];
    newRounds[roundIndex].topFiveCorrect[questionIndex][answerIndex] = isCorrect;
    setRounds(newRounds);
  };

  const endQuiz = () => {
    setShowResults(true);
  };

  const startNewQuiz = () => {
    setShowResults(false);
    setCurrentRound(1);
    setRounds([
      { number: 1, name: 'Round 1', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 2, name: 'Round 2', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 3, name: 'Round 3', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 4, name: 'Round 4', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 5, name: 'Round 5', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 6, name: 'Round 6', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) },
      { number: 7, name: 'Round 7', format: 'general-knowledge', questions: 10, pointsEach: 1, questionFormat: 'single', answers: Array(10).fill(''), correct: Array(10).fill(null), secondAnswers: Array(10).fill(''), secondCorrect: Array(10).fill(null), topFiveAnswers: Array(2).fill(null).map(() => Array(5).fill('')), topFiveCorrect: Array(2).fill(null).map(() => Array(5).fill(null)) }
    ]);
    setTeamName('');
    setQuizDate(new Date().toLocaleDateString());
  };

  const calculateRoundScore = (round: Round) => {
    let score = 0;

    if (round.questionFormat === 'connection') {
      for (let i = 0; i < 4; i++) {
        if (round.correct[i] === true) score += 1;
      }
      if (round.correct[4] === true) score += 2;
    } else if (round.questionFormat === 'dual' || round.questionFormat === 'easyhard') {
      for (let i = 0; i < round.questions; i++) {
        if (round.correct[i] === true) score += round.pointsEach;
        if (round.secondCorrect[i] === true) score += round.pointsEach;
      }
    } else if (round.questionFormat === 'allornothing') {
      for (let i = 0; i < round.questions; i++) {
        if (round.correct[i] === true && round.secondCorrect[i] === true) {
          score += round.pointsEach;
        }
      }
    } else if (round.questionFormat === 'topfive') {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 5; j++) {
          if (round.topFiveCorrect[i][j] === true) score += 1;
        }
      }
    } else {
      score = round.correct.filter(c => c === true).length * round.pointsEach;
    }

    return score;
  };

  const calculateTotalScore = () => {
    return rounds.reduce((total, round) => total + calculateRoundScore(round), 0);
  };

  const calculateTotalPossible = () => {
    return rounds.reduce((total, round) => {
      if (round.questionFormat === 'connection') {
        return total + 6;
      } else if (round.questionFormat === 'dual' || round.questionFormat === 'easyhard') {
        return total + (round.questions * round.pointsEach * 2);
      } else if (round.questionFormat === 'topfive') {
        return total + 10;
      } else {
        return total + (round.questions * round.pointsEach);
      }
    }, 0);
  };

  const getPercentage = () => {
    const total = calculateTotalScore();
    const possible = calculateTotalPossible();
    return possible > 0 ? Math.round((total / possible) * 100) : 0;
  };

  const getRoundStats = () => {
    const roundPerformances = rounds.map(round => {
      const score = calculateRoundScore(round);
      let possible;

      if (round.questionFormat === 'connection') {
        possible = 6;
      } else if (round.questionFormat === 'dual' || round.questionFormat === 'easyhard') {
        possible = round.questions * round.pointsEach * 2;
      } else if (round.questionFormat === 'topfive') {
        possible = 10;
      } else {
        possible = round.questions * round.pointsEach;
      }

      return {
        name: round.format,
        score,
        possible,
        percentage: possible > 0 ? Math.round((score / possible) * 100) : 0,
        type: round.questionFormat
      };
    });

    const bestRound = roundPerformances.reduce((best, current) =>
      current.percentage > best.percentage ? current : best, roundPerformances[0] || {});

    const worstRound = roundPerformances.reduce((worst, current) =>
      current.percentage < worst.percentage ? current : worst, roundPerformances[0] || {});

    return { roundPerformances, bestRound, worstRound };
  };

  const generateSummary = () => {
    const { roundPerformances, bestRound, worstRound } = getRoundStats();
    const totalCorrect = rounds.reduce((total, round) => total + round.correct.filter(c => c === true).length, 0);
    const totalQuestions = rounds.reduce((total, round) => total + round.questions, 0);

    return {
      teamName: teamName || 'Quiz Master',
      date: quizDate,
      totalScore: calculateTotalScore(),
      totalPossible: calculateTotalPossible(),
      percentage: getPercentage(),
      totalCorrect,
      totalQuestions,
      bestRound,
      worstRound,
      roundBreakdown: roundPerformances
    };
  };

  const getPerformanceEmoji = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 70) return '🎯';
    if (percentage >= 60) return '👍';
    if (percentage >= 50) return '📈';
    return '💪';
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'from-yellow-400 to-orange-500';
    if (percentage >= 70) return 'from-green-400 to-blue-500';
    if (percentage >= 60) return 'from-blue-400 to-purple-500';
    if (percentage >= 50) return 'from-purple-400 to-pink-500';
    return 'from-gray-400 to-gray-600';
  };

  if (showResults) {
    const summary = generateSummary();
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].resultsBackground} p-3`}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${themes[currentTheme].accent} bg-clip-text text-transparent mb-2`}>
                🎉 QUIZ COMPLETE!
              </h1>
              <p className="text-sm text-white font-semibold">{summary.teamName || 'Quiz Master'}</p>
              <p className="text-xs text-white/80">{summary.date}</p>
              <div className="text-4xl mt-2">{getPerformanceEmoji(summary.percentage)}</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-xl text-center shadow-xl">
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{summary.totalScore}</div>
              <div className="text-sm text-white/90 font-semibold">Final Score</div>
              <div className="text-xs text-white/80">out of {summary.totalPossible}</div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-4 rounded-xl text-center shadow-xl">
              <Target className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{summary.percentage}%</div>
              <div className="text-sm text-white/90 font-semibold">Success Rate</div>
              <div className="text-xs text-white/80">{summary.totalCorrect}/{summary.totalQuestions} correct</div>
            </div>

            <div className={`bg-gradient-to-br ${getPerformanceColor(summary.percentage)} p-4 rounded-xl text-center shadow-xl`}>
              <Crown className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {summary.percentage >= 80 ? 'CHAMPION!' : summary.percentage >= 70 ? 'EXCELLENT!' : summary.percentage >= 60 ? 'GREAT JOB!' : summary.percentage >= 50 ? 'GOOD EFFORT!' : 'KEEP TRYING!'}
              </div>
              <div className="text-sm text-white/90 font-semibold">Performance</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              📊 Round Results
            </h3>
            <div className="space-y-3">
              {summary.roundBreakdown.map((round, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white truncate mr-2">{round.name}</span>
                    <span className="text-sm text-white/90 whitespace-nowrap">{round.score}/{round.possible}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getPerformanceColor(round.percentage)} transition-all duration-1000 ease-out`}
                        style={{ width: `${round.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-white w-10">{round.percentage}%</span>
                    <span className="text-lg">{getPerformanceEmoji(round.percentage)}</span>
                  </div>
                  {round.type && (
                    <div className="text-xs text-white/60 mt-1">
                      {round.type === 'connection' ? 'Connection Round' :
                       round.type === 'easyhard' ? 'Easy/Hard Round' :
                       round.type === 'topfive' ? 'Top 5 Round' :
                       round.type === 'allornothing' ? 'All or Nothing' : 'Standard'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl mb-6 text-center">
            <div className="text-lg font-bold text-white mb-2">📸 Save Your Score!</div>
            <div className="text-sm text-white/90">Screenshot this page to remember your Quiz Master Dale results</div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startNewQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transform active:scale-95 transition-all text-lg font-semibold shadow-xl"
            >
              🚀 Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].background} p-3`}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${themes[currentTheme].accent} bg-clip-text text-transparent mb-2`}>
              🧠 QUIZ MASTER DALE
            </h1>
            <p className="text-sm text-white/80">Interactive Scoresheet</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="🏆 Your Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl text-white placeholder-white/60 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
          />
          <input
            type="text"
            placeholder="📅 Quiz Date"
            value={quizDate}
            onChange={(e) => setQuizDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl text-white placeholder-white/60 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
          />

          <div>
            <p className="text-sm text-white/80 mb-2">🎨 Theme:</p>
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
            >
              {Object.keys(themes).map(themeKey => (
                <option key={themeKey} value={themeKey} className="bg-gray-800 text-white">
                  {themes[themeKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-xl mb-4 text-center shadow-xl">
          <div className={`text-xl font-bold text-white transition-all duration-500 ${celebrationMode ? 'animate-bounce' : ''}`}>
            🎯 SCORE: {calculateTotalScore()}/{calculateTotalPossible()}
          </div>
          <div className="text-lg text-white/90">
            {getPercentage()}% {getPerformanceEmoji(getPercentage())}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {rounds.map((round, index) => (
              <button
                key={index}
                onClick={() => setCurrentRound(index + 1)}
                className={`px-3 py-2 rounded-lg font-bold text-sm transition-all transform active:scale-95 ${
                  currentRound === index + 1
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-lg text-white border border-white/30'
                }`}
              >
                {round.name}
                <span className="block text-xs mt-1">
                  {calculateRoundScore(round)}/{round.questionFormat === 'connection' ? 6 :
                    round.questionFormat === 'easyhard' ? round.questions * 2 :
                    round.questionFormat === 'topfive' ? 10 :
                    round.questions * round.pointsEach}
                </span>
              </button>
            ))}
          </div>
        </div>

        {rounds.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className={`mb-6 ${currentRound !== roundIndex + 1 ? 'hidden' : ''}`}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h2 className="text-xl font-bold mb-4 text-center text-white">
                🎯 {round.name}
                <span className="block text-sm text-white/80 mt-1">
                  {round.questions} questions • {roundFormats[round.format as any]?.description}
                </span>
              </h2>

              <div className="mb-4">
                <p className="text-sm text-white/80 mb-2 text-center">📋 Round Type:</p>
                <select
                  value={round.format}
                  onChange={(e) => setRoundFormat(roundIndex, e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                >
                  {Object.keys(roundFormats).map(format => (
                    <option key={format} value={format} className="bg-gray-800 text-white">
                      {format}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/60 mt-1 text-center">
                  {roundFormats[round.format as any]?.description}
                </p>
              </div>

              {round.questionFormat === 'topfive' ? (
                <div className="space-y-6">
                  {[0, 1].map((questionIndex) => (
                    <div key={questionIndex} className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex items-center mb-3">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                          {questionIndex + 1}
                        </div>
                        <h3 className="text-lg font-bold text-white">Question {questionIndex + 1}</h3>
                      </div>

                      <div className="space-y-2">
                        {[0, 1, 2, 3, 4].map((answerIndex) => (
                          <div key={answerIndex} className="flex items-center space-x-2">
                            <span className="text-white/80 text-sm w-4">{answerIndex + 1}.</span>
                            <input
                              type="text"
                              placeholder={`Answer ${answerIndex + 1}...`}
                              value={round.topFiveAnswers[questionIndex][answerIndex]}
                              onChange={(e) => updateTopFiveAnswer(roundIndex, questionIndex, answerIndex, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                            />
                            <button
                              onClick={() => markTopFiveAnswer(roundIndex, questionIndex, answerIndex, true)}
                              className={`p-2 rounded-lg transition-all transform active:scale-95 ${
                                round.topFiveCorrect[questionIndex][answerIndex] === true
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                  : 'bg-white/10 text-white/60 border border-white/30'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => markTopFiveAnswer(roundIndex, questionIndex, answerIndex, false)}
                              className={`p-2 rounded-lg transition-all transform active:scale-95 ${
                                round.topFiveCorrect[questionIndex][answerIndex] === false
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                                  : 'bg-white/10 text-white/60 border border-white/30'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: round.questions }, (_, questionIndex) => (
                    <div key={questionIndex} className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          round.questionFormat === 'connection' && questionIndex === 4
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {questionIndex + 1}
                          {round.questionFormat === 'connection' && questionIndex === 4 && (
                            <span className="ml-1 text-xs">🔗</span>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder={
                            round.questionFormat === 'connection' && questionIndex === 4
                              ? "🔗 What links them all?"
                              : round.questionFormat === 'easyhard'
                              ? "💭 Easy answer..."
                              : "💭 Your answer..."
                          }
                          value={round.answers[questionIndex]}
                          onChange={(e) => updateAnswer(roundIndex, questionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                        />
                      </div>

                      {(round.questionFormat === 'easyhard' || round.questionFormat === 'allornothing') && (
                        <div className="flex items-center space-x-3 mb-2 ml-11">
                          <input
                            type="text"
                            placeholder={round.questionFormat === 'easyhard' ? "🔥 Hard answer..." : "💭 Second answer..."}
                            value={round.secondAnswers[questionIndex]}
                            onChange={(e) => updateSecondAnswer(roundIndex, questionIndex, e.target.value)}
                            className={`flex-1 px-3 py-2 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm ${
                              round.questionFormat === 'easyhard'
                                ? 'bg-red-900/20 border-red-500/30'
                                : 'bg-white/10'
                            }`}
                          />
                        </div>
                      )}

                      <div className="flex space-x-2 justify-center">
                        <div className="flex space-x-1 flex-1">
                          <button
                            onClick={() => markQuestion(roundIndex, questionIndex, true)}
                            className={`flex-1 py-2 px-2 rounded-lg transition-all transform active:scale-95 flex items-center justify-center text-xs ${
                              round.correct[questionIndex] === true
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                : 'bg-white/10 text-white/60 border border-white/30'
                            }`}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {round.questionFormat === 'easyhard' ? 'Easy ✓' :
                             round.questionFormat === 'allornothing' ? '1st ✓' : 'Correct'}
                          </button>

                          <button
                            onClick={() => markQuestion(roundIndex, questionIndex, false)}
                            className={`flex-1 py-2 px-2 rounded-lg transition-all transform active:scale-95 flex items-center justify-center text-xs ${
                              round.correct[questionIndex] === false
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                                : 'bg-white/10 text-white/60 border border-white/30'
                            }`}
                          >
                            <X className="w-3 h-3 mr-1" />
                            {round.questionFormat === 'easyhard' ? 'Easy ✗' :
                             round.questionFormat === 'allornothing' ? '1st ✗' : 'Wrong'}
                          </button>
                        </div>

                        {(round.questionFormat === 'easyhard' || round.questionFormat === 'allornothing') && (
                          <div className="flex space-x-1 flex-1">
                            <button
                              onClick={() => markSecondQuestion(roundIndex, questionIndex, true)}
                              className={`flex-1 py-2 px-2 rounded-lg transition-all transform active:scale-95 flex items-center justify-center text-xs ${
                                round.secondCorrect[questionIndex] === true
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                  : 'bg-white/10 text-white/60 border border-white/30'
                              }`}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              {round.questionFormat === 'easyhard' ? 'Hard ✓' : '2nd ✓'}
                            </button>

                            <button
                              onClick={() => markSecondQuestion(roundIndex, questionIndex, false)}
                              className={`flex-1 py-2 px-2 rounded-lg transition-all transform active:scale-95 flex items-center justify-center text-xs ${
                                round.secondCorrect[questionIndex] === false
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                                  : 'bg-white/10 text-white/60 border border-white/30'
                              }`}
                            >
                              <X className="w-3 h-3 mr-1" />
                              {round.questionFormat === 'easyhard' ? 'Hard ✗' : '2nd ✗'}
                            </button>
                          </div>
                        )}
                      </div>

                      {(round.questionFormat === 'connection' || round.questionFormat === 'easyhard' || round.questionFormat === 'allornothing') && (
                        <div className="mt-2 text-center">
                          <span className="text-xs text-white/60">
                            {round.questionFormat === 'connection' && questionIndex === 4
                              ? `Connection: ${round.correct[questionIndex] === true ? '2pts' : '0pts'}`
                              : round.questionFormat === 'easyhard'
                              ? `Score: ${(round.correct[questionIndex] === true ? 1 : 0) + (round.secondCorrect[questionIndex] === true ? 1 : 0)}pts`
                              : round.questionFormat === 'allornothing'
                              ? `Score: ${(round.correct[questionIndex] === true && round.secondCorrect[questionIndex] === true) ? 1 : 0}pts`
                              : ''
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <div className="text-lg font-bold text-white">
                    🎯 Round: {calculateRoundScore(round)}/{round.questionFormat === 'connection' ? 6 :
                      round.questionFormat === 'easyhard' ? round.questions * 2 :
                      round.questionFormat === 'topfive' ? 10 :
                      round.questions * round.pointsEach}
                  </div>
                  <div className="text-sm text-white/90">
                    ({(() => {
                      const score = calculateRoundScore(round);
                      const possible = round.questionFormat === 'connection' ? 6 :
                        round.questionFormat === 'easyhard' ? round.questions * 2 :
                        round.questionFormat === 'topfive' ? 10 :
                        round.questions * round.pointsEach;
                      return possible > 0 ? Math.round((score / possible) * 100) : 0;
                    })()}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="space-y-3 pb-6">
          <button
            onClick={endQuiz}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-pink-700 flex items-center justify-center text-lg font-bold transform active:scale-95 transition-all shadow-xl"
          >
            🏁 End Quiz & See Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScoresheet;
