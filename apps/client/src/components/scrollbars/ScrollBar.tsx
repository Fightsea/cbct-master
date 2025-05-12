import styled from '@emotion/styled'
import { useRef, useImperativeHandle, forwardRef, ForwardedRef } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

type Props = {
  children: React.ReactNode
  width?: string
  height?: string
  fullHeight?: boolean
}

export interface ScrollBarHandle {
  recalculate: () => void;
}

const CustomSimpleBar = styled(SimpleBar)<{ $fullHeight?: boolean }>(({ $fullHeight }) => ({
  '.simplebar-content': {
    height: $fullHeight ? '100%' : 'auto',
    width: 'calc(100% - 12px)',
    maxWidth: 'calc(100% - 12px)',
    transform: 'translateX(12px)'
  },
  '.simplebar-track.simplebar-vertical': {
    width: '12px'
  }
}))

const ScrollBar = forwardRef<ScrollBarHandle, Props>(
  ({ children, width, height = '100%', fullHeight = false }, ref: ForwardedRef<ScrollBarHandle>) => {
    const simpleBarRef = useRef(null)

    useImperativeHandle(ref, () => ({
      recalculate: () => {
        if (simpleBarRef.current) {
          const instance = simpleBarRef.current as any
          if (typeof instance.recalculate === 'function') {
            instance.recalculate()
          }
        }
      }
    }), [])

    return (
      <CustomSimpleBar
        ref={simpleBarRef}
        style={{
          height: height,
          width: width
        }}
        $fullHeight={fullHeight}
      >
        {children}
      </CustomSimpleBar>
    )
  }
)

ScrollBar.displayName = 'ScrollBar'

export default ScrollBar
