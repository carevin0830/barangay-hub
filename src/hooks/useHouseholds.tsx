import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Household {
  id: string;
  house_number: string;
  purok: string | null;
  street_address: string | null;
  latitude: number | null;
  longitude: number | null;
  has_electricity: boolean;
  has_water: boolean;
  created_at: string;
  updated_at: string;
}

export const useHouseholds = () => {
  const { toast } = useToast();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHouseholds = async () => {
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHouseholds(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching households',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addHousehold = async (household: Omit<Household, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('households')
        .insert([household])
        .select()
        .single();

      if (error) throw error;

      setHouseholds([data, ...households]);
      toast({
        title: 'Household added',
        description: `House ${household.house_number} has been added successfully.`,
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error adding household',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateHousehold = async (id: string, updates: Partial<Household>) => {
    try {
      const { data, error } = await supabase
        .from('households')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setHouseholds(households.map(h => h.id === id ? data : h));
      toast({
        title: 'Household updated',
        description: `House ${updates.house_number || ''} has been updated.`,
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error updating household',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteHousehold = async (id: string) => {
    try {
      const { error } = await supabase
        .from('households')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHouseholds(households.filter(h => h.id !== id));
      toast({
        title: 'Household deleted',
        description: 'The household has been removed.',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting household',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  return {
    households,
    loading,
    addHousehold,
    updateHousehold,
    deleteHousehold,
    refetch: fetchHouseholds,
  };
};
