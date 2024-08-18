import { parseEther, formatEther } from 'viem';

export const subtract = (a: number, b: number) => {
  return Number(formatEther(parseEther(a.toString()) - parseEther(b.toString())));
};

export const add = (a: number, b: number) => {
  return Number(formatEther(parseEther(a.toString()) + parseEther(b.toString())));
};
