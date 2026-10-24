import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhysicalBook } from '../src/components/PhysicalBook';
import { defaultAlbum } from '../src/data/default-album';
import { makeTurn, targetPage } from '../src/app/album-flow';
afterEach(()=>{cleanup();vi.useRealTimers()});
describe('book navigation',()=>{
 it('bounds navigation and rejects invalid turns',()=>{expect(targetPage(0,-1)).toBe(0);expect(targetPage(7,1)).toBe(7);expect(makeTurn(0,9)).toBeNull();expect(makeTurn(2,2)).toBeNull()});
 it('reaches the ending, blocks repeated turns, and preserves an already lit diya',()=>{
  vi.useFakeTimers();render(<PhysicalBook album={defaultAlbum} quiet={false} onClose={vi.fn()} onReplay={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:'Light the diya'}));
  const next=screen.getByRole('button',{name:'Next page'});
  fireEvent.click(next);fireEvent.click(next);act(()=>vi.advanceTimersByTime(1000));
  expect(screen.getByRole('region',{name:'Two homes, one Diwali'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Previous page'}));act(()=>vi.advanceTimersByTime(1000));
  expect(screen.getByRole('button',{name:'Your diya is glowing'})).toBeDisabled();
  for(let i=0;i<7;i++){fireEvent.click(next);act(()=>vi.advanceTimersByTime(1000))}
  expect(screen.getByRole('region',{name:'A little light stays'})).toBeInTheDocument();expect(next).toBeDisabled();
 });
 it('supports reduced-motion keyboard navigation and chapter revisits',()=>{
  vi.useFakeTimers();render(<PhysicalBook album={defaultAlbum} quiet onClose={vi.fn()} onReplay={vi.fn()}/>);
  fireEvent.keyDown(window,{key:'ArrowRight'});act(()=>vi.advanceTimersByTime(40));
  expect(screen.getByRole('region',{name:'Two homes, one Diwali'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Chapters/}));
  fireEvent.click(screen.getByRole('button',{name:/A Letter from Me/}));act(()=>vi.advanceTimersByTime(40));
  expect(screen.getByRole('button',{name:'Open your letter'})).toBeInTheDocument();
 });
});
