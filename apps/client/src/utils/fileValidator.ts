export type FileTypeConfig = {
  extensions: readonly string[]
}

export const FileTypes = {
  PHOTO: {
    extensions: ['.jpg', '.jpeg', '.png']
  },
  CBCT: {
    extensions: ['.dcm']
  },
  XRAY: {
    extensions: ['.jpg', '.jpeg']
  },
  ORAL_SCAN: {
    extensions: ['.stl']
  }
}

export const isValidFileType = (file: File, type: FileTypeConfig): boolean => {
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
  return type.extensions.includes(extension)
}

export const findInvalidFiles = (files: FileList | null, type: FileTypeConfig): File[] => {
  if (!files) return []

  return Array.from(files).filter(file => !isValidFileType(file, type))
}
