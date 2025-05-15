import parse from 'html-react-parser';

export const highlightText = (text: string, highlight: string) => {
  if (!text) {
    return ''
  } else if (!highlight) {
    return text
  }

  const tagStart = '<b style="color:black; background-color:gold;">'
  const tagEnd = '</b>'

  const escaped = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(escaped, 'giu'); // Replacement (Case Insensitive)

  return parse(text.replace(regex, (match) => `${tagStart}${match}${tagEnd}`)) as string
}
