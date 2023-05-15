import { useMutation, useQueryClient } from '@tanstack/react-query';
import jsonpatch from 'fast-json-patch';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate: patchUser } = useMutation(
    (newData: User | null) => patchUserOnServer(newData, user),
    {
      onMutate: async (newData: User | null) => {
        queryClient.cancelQueries(queryKeys.user);

        const previousUserData: User = queryClient.getQueryData(queryKeys.user);

        updateUser(previousUserData);

        return { previousUserData };
      },
      onError: (error, newData, context) => {
        if (context.previousUserData) {
          updateUser(context.previousUserData);
          toast({
            title: 'User update failed!: restoring previous data',
            status: 'warning',
          });
        }
      },
      onSuccess: (userData: User | null) => {
        if (user) {
          toast({
            title: 'User updated!',
            status: 'success',
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return patchUser;
}
