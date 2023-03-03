import { useQuery } from '@tanstack/react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments() {
  const { data } = await axiosInstance.get<Treatment[]>('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const toast = useCustomToast();

  const fallback: Treatment[] = [];
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : 'error connectint to server';
      toast({ title, status: 'error' });
    },
  });
  return data;
}
