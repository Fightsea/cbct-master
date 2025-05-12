import zlib from 'zlib';

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }

  return true;
};

export const parseBase64ToText = (encodedString: string): string => {
  const compressedData = Buffer.from(encodedString, 'base64');
  const data = zlib.gunzipSync(compressedData);
  return data.toString('utf-8');
};
