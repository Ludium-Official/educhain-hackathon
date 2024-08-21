import { parseEther, formatEther } from 'viem';

export const subtract = (a: string, b: string): string => {
  return formatEther(parseEther(a.toString()) - parseEther(b.toString()));
};

export const add = (a: string, b: string): string => {
  return formatEther(parseEther(a.toString()) + parseEther(b.toString()));
};
