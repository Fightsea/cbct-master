export const assetProviderOrigin = `https://${process.env.ASSET_PROVIDER_DOMAIN}`;

export const getImageUrl = (path: string): Url => {
  return `${assetProviderOrigin}/${path}`;
};

export const getDirectory = (path: string) => {
  return getImageUrl(path).substring(0, getImageUrl(path).lastIndexOf('/') + 1);
};

export const convertS3UriToUrl = (s3Uri: string) => {
  const match = s3Uri.match(/^s3:\/\/[^/]+(\/.+)$/);
  if (match) {
    const path = match[1];
    return `${assetProviderOrigin}${path}`;
  }

  return s3Uri;
};
