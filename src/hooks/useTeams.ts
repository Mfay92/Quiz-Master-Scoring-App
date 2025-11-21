import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Team {
  id: string;
  name: string;
  creator_id: string;
  description?: string;
  is_public: boolean;
  created_at: string;
}

interface _TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
}

// Export for future use
export type TeamMember = _TeamMember;

export const useTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .or(`creator_id.eq.${user.id},id.in(select team_id from team_members where user_id = '${user.id}')`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTeams(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch teams';
      setError(message);
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTeam = useCallback(
    async (name: string, description?: string, isPublic = false) => {
      if (!user) throw new Error('No user logged in');

      setLoading(true);
      setError(null);

      try {
        const { data: newTeam, error: createError } = await supabase
          .from('teams')
          .insert({
            name,
            description,
            is_public: isPublic,
            creator_id: user.id
          })
          .select()
          .single();

        if (createError) throw createError;

        // Add creator as team member
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: newTeam.id,
            user_id: user.id
          });

        if (memberError) throw memberError;

        setTeams(prev => [newTeam, ...prev]);
        return newTeam;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create team';
        setError(message);
        console.error('Error creating team:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateTeam = useCallback(
    async (teamId: string, name: string, description?: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data: updatedTeam, error: updateError } = await supabase
          .from('teams')
          .update({ name, description })
          .eq('id', teamId)
          .select()
          .single();

        if (updateError) throw updateError;

        setTeams(prev =>
          prev.map(team => (team.id === teamId ? updatedTeam : team))
        );
        return updatedTeam;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update team';
        setError(message);
        console.error('Error updating team:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTeam = useCallback(async (teamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (deleteError) throw deleteError;

      setTeams(prev => prev.filter(team => team.id !== teamId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete team';
      setError(message);
      console.error('Error deleting team:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeamMember = useCallback(
    async (teamId: string, userEmail: string) => {
      setLoading(true);
      setError(null);

      try {
        // First, find the user by email
        const { data: users, error: searchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail);

        if (searchError) throw searchError;
        if (!users || users.length === 0) {
          throw new Error('User not found');
        }

        const targetUserId = users[0].id;

        // Add team member
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: targetUserId
          });

        if (memberError) throw memberError;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add team member';
        setError(message);
        console.error('Error adding team member:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeTeamMember = useCallback(
    async (teamId: string, userId: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('user_id', userId);

        if (error) throw error;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove team member';
        setError(message);
        console.error('Error removing team member:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember
  };
};
