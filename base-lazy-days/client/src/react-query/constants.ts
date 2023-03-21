/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const queryKeys = {
  treatments: ['treatments'],
  appointments: (year: string, month: string) => ['appointments', year, month],
  user: ['user'],
  staff: ['staff'],
  userAppintments: ['user-appointments'],
};
