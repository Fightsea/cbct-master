export const convertToProxyUrl = (url: string): string => {
  if (!url) return ''

  const serverOrigin = process.env.NEXT_PUBLIC_ASSET_PROVIDER_DOMAIN
  const proxyUrl = url.replace(`https://${serverOrigin}/`, '/proxy/')

  return proxyUrl
}
