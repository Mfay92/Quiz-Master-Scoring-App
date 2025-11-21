import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface QuizAttempt {
  id: string;
  quiz_id: string;
  team_id: string;
  user_id: string;
  total_score: number;
  max_score: number;
  percentage: number;
  started_at: string;
  completed_at?: string;
}

interface _QuizScore {
  id: string;
  quiz_attempt_id: string;
  round_number: number;
  round_format: string;
  questions_data: any[];
  round_score: number;
  max_round_score: number;
}

// Export for future use
export type QuizScore = _QuizScore;

export const useQuizzes = () => {
  const { user } = useAuth();
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuizAttempt = useCallback(
    async (quizId: string, teamId: string) => {
      if (!user) throw new Error('No user logged in');

      setLoading(true);
      setError(null);

      try {
        const { data: attempt, error: createError } = await supabase
          .from('quiz_attempts')
          .insert({
            quiz_id: quizId,
            team_id: teamId,
            user_id: user.id
          })
          .select()
          .single();

        if (createError) throw createError;

        setQuizAttempts(prev => [attempt, ...prev]);
        return attempt;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start quiz attempt';
        setError(message);
        console.error('Error starting quiz attempt:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const saveQuizScore = useCallback(
    async (
      quizAttemptId: string,
      roundNumber: number,
      roundFormat: string,
      questionsData: any[],
      roundScore: number,
      maxRoundScore: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const { data: score, error: saveError } = await supabase
          .from('quiz_scores')
          .insert({
            quiz_attempt_id: quizAttemptId,
            round_number: roundNumber,
            round_format: roundFormat,
            questions_data: questionsData,
            round_score: roundScore,
            max_round_score: maxRoundScore
          })
          .select()
          .single();

        if (saveError) throw saveError;

        return score;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save quiz score';
        setError(message);
        console.error('Error saving quiz score:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const completeQuizAttempt = useCallback(
    async (quizAttemptId: string, totalScore: number, maxScore: number) => {
      setLoading(true);
      setError(null);

      try {
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

        const { data: updated, error: updateError } = await supabase
          .from('quiz_attempts')
          .update({
            total_score: totalScore,
            max_score: maxScore,
            percentage,
            completed_at: new Date().toISOString()
          })
          .eq('id', quizAttemptId)
          .select()
          .single();

        if (updateError) throw updateError;

        setQuizAttempts(prev =>
          prev.map(attempt =>
            attempt.id === quizAttemptId ? updated : attempt
          )
        );

        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete quiz attempt';
        setError(message);
        console.error('Error completing quiz attempt:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTeamQuizAttempts = useCallback(
    async (teamId: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('team_id', teamId)
          .order('completed_at', { ascending: false });

        if (fetchError) throw fetchError;

        setQuizAttempts(data || []);
        return data || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch quiz attempts';
        setError(message);
        console.error('Error fetching quiz attempts:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchQuizScores = useCallback(
    async (quizAttemptId: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('quiz_scores')
          .select('*')
          .eq('quiz_attempt_id', quizAttemptId)
          .order('round_number', { ascending: true });

        if (fetchError) throw fetchError;

        return data || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch quiz scores';
        setError(message);
        console.error('Error fetching quiz scores:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    quizAttempts,
    loading,
    error,
    startQuizAttempt,
    saveQuizScore,
    completeQuizAttempt,
    fetchTeamQuizAttempts,
    fetchQuizScores
  };
};
