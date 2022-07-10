import { Box } from '@chakra-ui/react';
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => {
  return (
    <Box>
      <>dasdas</>
      {children}
    </Box>
  )
}

export default Layout;