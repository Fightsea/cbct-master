import { types } from 'pg';
import { getMomentByFormatTZ, getMomentByFormat } from '@cbct/utils/moment';

const { setTypeParser, builtins } = types;

// Set return format of specific data types
export const overrideTypeParser = (): void => {
  setTypeParser(builtins.DATE, (v: any) => getMomentByFormat('YYYY-MM-DD', v));
  setTypeParser(builtins.TIMETZ, (v: any) => getMomentByFormatTZ('HH:mm:ss', v));
  setTypeParser(builtins.TIMESTAMP, (v: any) => getMomentByFormat('YYYY-MM-DD HH:mm:ss', v));
  setTypeParser(builtins.TIMESTAMPTZ, (v: any) => getMomentByFormatTZ('YYYY-MM-DD HH:mm:ss', v));
};
