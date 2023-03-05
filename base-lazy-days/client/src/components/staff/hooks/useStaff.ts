import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff() {
  const { data } = await axiosInstance.get<Staff[]>('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');

  const filterStaffs = useCallback(
    (data: Staff[]): Staff[] => filterByTreatment(data, filter),
    [filter],
  );
  // TODO: get data from server via useQuery
  const fallback: Staff[] = [];
  const { data: staff = fallback } = useQuery(queryKeys.staff, getStaff, {
    select: filter === 'all' ? undefined : filterStaffs,
  });

  return { staff, filter, setFilter };
}
