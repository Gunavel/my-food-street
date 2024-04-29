import { pino } from 'pino';
export const getLogger = ({ name }: { name: string }) => {
  return pino({ name });
};
