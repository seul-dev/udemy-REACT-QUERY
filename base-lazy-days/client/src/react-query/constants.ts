/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const queryKeys = {
  treatments: ['treatments'],
  appointments: ['appointments'],
  appointmentsByMonth: (year: string, month: string) => [
    'appointments',
    year,
    month,
  ],
  user: ['user'],
  staff: ['staff'],
  userAppointments: ['appointments', 'user'],
} as const;
