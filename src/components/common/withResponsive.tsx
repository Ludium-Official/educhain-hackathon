import React from 'react';
import { useMedia } from '@/hooks/useMedia';

interface WithResponsivePcChildren {
  pc: JSX.Element;
}

interface WithResponsiveMobileChildren {
  mobile: JSX.Element;
}

interface WithResponsiveProps {
  children: WithResponsivePcChildren | WithResponsiveMobileChildren;
}

const WithResponsive: React.FC<WithResponsiveProps> = ({ children }) => {
  const { isMobile } = useMedia();

  const hasPcChildren = (
    child: WithResponsivePcChildren | WithResponsiveMobileChildren,
  ): child is WithResponsivePcChildren => {
    return !!(child as WithResponsivePcChildren).pc;
  };

  const hasMobileChildren = (
    child: WithResponsivePcChildren | WithResponsiveMobileChildren,
  ): child is WithResponsiveMobileChildren => {
    return !!(child as WithResponsiveMobileChildren).mobile;
  };

  if (isMobile && hasMobileChildren(children)) {
    return children.mobile;
  } else if (!isMobile && hasPcChildren(children)) {
    return children.pc;
  }

  return null;
};

export default WithResponsive;
