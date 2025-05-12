import moment, { MomentInput } from 'moment';
import { max } from './math';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm:ss';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const getMomentByFormatTZ = (format: string, input?: MomentInput) => moment(input).utcOffset(8).format(format);

export const getMomentByFormat = (format: string, input?: MomentInput) => moment(input).format(format);

export const getNowDate = (): date => getMomentByFormatTZ(DATE_FORMAT);

export const getNowTime = (): time => getMomentByFormatTZ(TIME_FORMAT);

export const getNowDatetime = (): datetime => getMomentByFormatTZ(DATETIME_FORMAT);

export const getAge = (birthday: date) => {
  const birthDate = moment(birthday, DATE_FORMAT);
  return max(moment().diff(birthDate, 'years'), 0);
};
