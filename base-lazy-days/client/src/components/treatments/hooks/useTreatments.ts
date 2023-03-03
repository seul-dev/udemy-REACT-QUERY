import { useQuery } from '@tanstack/react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';

async function getTreatments() {
  const { data } = await axiosInstance.get<Treatment[]>('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback: Treatment[] = [];
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);
  return data;
}
