import { Html, Head, Main, NextScript, type DocumentProps } from 'next/document'
import {
  DocumentHeadTags,
  type DocumentHeadTagsProps
} from '@mui/material-nextjs/v14-pagesRouter'

const Document = (props: DocumentProps & DocumentHeadTagsProps) => {
  return (
    <Html lang={'en'}>
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
