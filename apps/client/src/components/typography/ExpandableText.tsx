import { useState, useRef, useEffect } from 'react'
import { Typography, Button, Box } from '@mui/material'

type Props = {
  text: string
  maxLines?: number
  onClick?: () => void
}

const ExpandableText = ({ text, maxLines = 3, onClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const checkOverflow = () => {
    const element = textRef.current
    if (element) {
      const isTextOverflow = element.scrollHeight > element.clientHeight
      setIsOverflow(isTextOverflow)
    }
  }

  useEffect(() => {
    checkOverflow()

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', checkOverflow)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text, maxLines, isExpanded])

  return (
    <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'end', gap: 1.5 }}>
      <Typography
        ref={textRef}
        sx={{
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 400,
          textWrap: 'wrap',
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxHeight: isExpanded ? '500px' : '4.5em',
          transition: 'max-height 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          flex: 1
        }}
      >
        {text}
      </Typography>
      <Box sx={{ flexShrink: 0}}>
        {isOverflow && !isExpanded && (
          <Button
            onClick={() => {
              setIsExpanded(true)
              onClick?.()
            }}
            sx={{
              minWidth: 'unset',
              textWrap: 'nowrap',
              padding: '1.5px 8px',
              color: '#3E3E3E',
              fontSize: 14,
              lineHeight: '150%',
              fontWeight: 600,
              border: '0.5px solid #E9EBF4',
              borderRadius: '8px',
              backgroundColor: '#FAFAFA',
              transition: 'opacity 1.5s ease',
              '&:hover': {
                backgroundColor: '#E9EBF4',
                borderColor: '#C6CAE2'
              }
            }}
          >
              Read More...
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ExpandableText
