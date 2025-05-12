declare module 'cornerstone-wado-image-loader' {
  import * as cornerstone from 'cornerstone-core'
  import * as dicomParser from 'dicom-parser'

  interface DICOMImageLoader {
    external: {
      cornerstone: typeof cornerstone
      dicomParser: typeof dicomParser
    };
    configure(options: any): void;
  }

  const dicomImageLoader: DICOMImageLoader
  export default dicomImageLoader
}
