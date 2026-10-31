import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import App from '../App';
import { birthday } from '../data/birthday';
import { memories } from '../data/memories';
import { quiz } from '../data/quiz';
import { capybaraMessages } from '../data/capybara';
import { validateQuiz, enumerateRoutes } from '../data/quizGraph';

const ids = memories.map((m) => m.id);

describe('data', () => {
  it('quiz is valid, every ending reachable, no loops', () => {
    expect(validateQuiz(quiz, ids)).toEqual([]);
    expect([...enumerateRoutes(quiz).keys()].sort()).toEqual(Object.keys(quiz.outcomes).sort());
  });
  it('each memory has its own quote, five are featured', () => {
    expect(new Set(memories.map((m) => m.quote)).size).toBe(memories.length);
    expect(birthday.featuredMemoryIds).toHaveLength(5);
  });
  it('capybara has a message list for every event used in the app', () => {
    ['stickerFirst', 'decorateDone', 'wishPrompt', 'welcomeOpened', 'worldAwake', 'pinboardPhotoOpened', 'quoteRevealed', 'photoBookOpened', 'pageTurned', 'quizStarted', 'quizAnswerSelected', 'quizOutcome', 'cakeDrawing', 'candlesLit', 'wishMade', 'candlesBlown', 'finalMessage'].forEach((k) => expect(capybaraMessages[k]?.length).toBeGreaterThan(0));
  });
});

describe('experience', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  const tick = (ms) => act(() => { vi.advanceTimersByTime(ms); });
  const click = (el) => act(() => { fireEvent.click(el); });
  const root = (c) => c.querySelector('.app');

  it('welcome shows five featured photos, then wakes up into color', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('.wphoto')).toHaveLength(5);
    expect(root(container).dataset.world).toBe('sketch');
    click(screen.getByRole('button', { name: birthday.welcomeButton }));
    expect(root(container).dataset.world).toBe('color');
    expect(screen.getByRole('navigation')).toBeTruthy();
    tick(3000);
    expect(root(container).dataset.waking).toBe('done');
    expect(screen.getByRole('button', { name: birthday.welcomeAfterButton })).toBeTruthy();
  });

  it('capybara speaks on meaningful events, one bubble at a time', () => {
    const { container } = render(<App />);
    tick(2100);
    expect(container.querySelectorAll('.capy-bubble p')).toHaveLength(1);
  });

  it('pinboard: every photo shows its own quote, keyboard closes it', () => {
    const { container } = render(<App initialPage="pinboard" initialWorld="color" />);
    const btns = container.querySelectorAll('.pb-btn');
    expect(btns).toHaveLength(memories.length);
    [0, 3, 6].forEach((i) => {
      click(btns[i]);
      expect(screen.getByRole('region', { name: /Note for/ }).textContent).toContain(memories[i].quote);
    });
    act(() => { fireEvent.keyDown(window, { key: 'ArrowLeft' }); });
    expect(screen.getByRole('region', { name: /Note for/ }).textContent).toContain(memories[5].quote);
    act(() => { fireEvent.keyDown(window, { key: 'Escape' }); });
    expect(screen.queryByRole('region', { name: /Note for/ })).toBeNull();
  });

  it('photo book: open, turn through every page, close', () => {
    render(<App initialPage="book" initialWorld="color" />);
    click(screen.getByRole('button', { name: birthday.bookOpenButton }));
    for (let i = 0; i < memories.length; i++) {
      expect(screen.getByText(memories[i].title)).toBeTruthy();
      click(screen.getByRole('button', { name: 'Next page' }));
      tick(1100);
    }
    expect(screen.getByText(/last page/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next page' }).disabled).toBe(true);
    act(() => { fireEvent.keyDown(window, { key: 'ArrowLeft' }); });
    tick(1100);
    expect(screen.getByText(memories[memories.length - 1].title)).toBeTruthy();
    click(screen.getByRole('button', { name: 'Close the book' }));
    expect(screen.getByRole('button', { name: birthday.bookOpenButton })).toBeTruthy();
  });

  it('quiz: different choices lead to different endings; restart and back work', () => {
    render(<App initialPage="quiz" initialWorld="color" />);
    const play = (texts) => {
      click(screen.getByRole('button', { name: 'Let me play' }));
      texts.forEach((t) => { click(screen.getByRole('button', { name: new RegExp(t) })); click(screen.getByRole('button', { name: 'Continue' })); });
    };
    play(['quiet afternoon', 'Sit very still']);
    expect(screen.getByText(quiz.outcomes['out-garden'].title)).toBeTruthy();
    click(screen.getByRole('button', { name: 'Try another path' }));
    click(screen.getByRole('button', { name: /tiny adventure/ }));
    click(screen.getByRole('button', { name: 'Pick something else' }));
    expect(screen.getByRole('button', { name: /tiny adventure/ })).toBeTruthy();
    click(screen.getByRole('button', { name: /tiny adventure/ })); click(screen.getByRole('button', { name: 'Continue' }));
    click(screen.getByRole('button', { name: /Go back to my last answer/ }));
    click(screen.getByRole('button', { name: /tiny adventure/ })); click(screen.getByRole('button', { name: 'Continue' }));
    click(screen.getByRole('button', { name: /winding path/ })); click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText(quiz.outcomes['out-journey'].title)).toBeTruthy();
    expect(screen.getByText(/found so far: 2 of 5/)).toBeTruthy();
  });

  it('cake: draws itself, wish, blow out, final message, relight', () => {
    const { container } = render(<App initialPage="cake" initialWorld="color" />);
    expect(container.querySelectorAll('.flame')).toHaveLength(birthday.candleCount);
    expect(screen.queryByRole('button', { name: birthday.wishButton })).toBeNull();
    tick(12000);
    click(screen.getByRole('button', { name: birthday.decorateSkip }));
    click(screen.getByRole('button', { name: birthday.wishButton }));
    expect(screen.getByText(birthday.wishMessage)).toBeTruthy();
    expect([...container.querySelectorAll('.flame')].every((f) => f.dataset.s === 'lit')).toBe(true);
    click(screen.getByRole('button', { name: birthday.blowButton }));
    expect([...container.querySelectorAll('.flame')].every((f) => f.dataset.s === 'blowing')).toBe(true);
    expect(container.querySelector('.gust')).toBeTruthy();
    tick(2000);
    expect([...container.querySelectorAll('.flame')].every((f) => f.dataset.s === 'out')).toBe(true);
    tick(1000);
    expect(screen.getByText(birthday.finalMessage)).toBeTruthy();
    expect(screen.getByText(birthday.closingLine)).toBeTruthy();
    click(screen.getByRole('button', { name: 'Light them again' }));
    tick(3000);
    expect([...container.querySelectorAll('.flame')].every((f) => f.dataset.s === 'lit')).toBe(true);
  });

  it('finale is locked until the candles are blown out', () => {
    const { container } = render(<App initialPage="pinboard" initialWorld="color" />);
    click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Finale' }));
    expect(container.querySelector('.cake-page')).toBeTruthy();
  });

  it('finale page renders when unlocked', () => {
    render(<App initialPage="finale" initialWorld="color" initialFinished />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(birthday.recipientName);
  });

  it('typed wish: kept, flies away as a paper plane, and is waiting on the finale', () => {
    const { container } = render(<App initialPage="cake" initialWorld="color" />);
    tick(12000);
    click(screen.getByRole('button', { name: birthday.decorateSkip }));
    fireEvent.change(screen.getByLabelText('Your wish'), { target: { value: 'a very good year' } });
    click(screen.getByRole('button', { name: birthday.wishButton }));
    expect(screen.getByText(/a very good year/)).toBeTruthy();
    click(screen.getByRole('button', { name: birthday.blowButton }));
    tick(2000);
    expect(container.querySelector('.wish-plane')).toBeTruthy();
    tick(1000);
    expect(screen.getByText(birthday.wishSent)).toBeTruthy();
    click(screen.getByRole('button', { name: 'On to the finale' }));
    click(screen.getByRole('button', { name: birthday.finale.keptWishOpen }));
    expect(screen.getByText(/a very good year/)).toBeTruthy();
  });

  it('quiz ending is remembered and shows up on the finale', () => {
    render(<App initialPage="quiz" initialWorld="color" initialFinished />);
    click(screen.getByRole('button', { name: 'Let me play' }));
    ['quiet afternoon', 'Sit very still'].forEach((t) => { click(screen.getByRole('button', { name: new RegExp(t) })); click(screen.getByRole('button', { name: 'Continue' })); });
    click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Finale' }));
    expect(screen.getByText(new RegExp(quiz.outcomes['out-garden'].title))).toBeTruthy();
    expect(screen.getByText(/You picked the garden/)).toBeTruthy();
  });

  it('progress survives a refresh', () => {
    const first = render(<App />);
    click(screen.getByRole('button', { name: birthday.welcomeButton }));
    first.unmount();
    const { container } = render(<App />);
    expect(container.querySelector('.app').dataset.world).toBe('color');
  });

  it('voice note player hides itself when the audio file is missing', () => {
    const { container } = render(<App initialPage="finale" initialWorld="color" initialFinished />);
    expect(container.querySelector('.voice')).toBeTruthy();
    act(() => { fireEvent.error(container.querySelector('audio')); });
    expect(container.querySelector('.voice')).toBeNull();
  });

  it('page curl: a bending leaf shows while the page turns, then the new page is in place', () => {
    const { container } = render(<App initialPage="book" initialWorld="color" />);
    click(screen.getByRole('button', { name: birthday.bookOpenButton }));
    click(screen.getByRole('button', { name: 'Next page' }));
    expect(container.querySelectorAll('.pbk-slice')).toHaveLength(10);
    expect(container.querySelector('.pbk-leaf-fade').getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeTruthy();
    tick(1100);
    expect(container.querySelector('.pbk-leaf')).toBeNull();
    expect(screen.getByText(memories[1].title)).toBeTruthy();
    click(screen.getByRole('button', { name: 'Previous page' }));
    expect(container.querySelector('.pbk-leaf')).toBeTruthy();
    tick(1100);
    expect(screen.getByText(memories[0].title)).toBeTruthy();
  });

  it('decorating: stickers can be added, undone, cleared, and are remembered', () => {
    const first = render(<App initialPage="cake" initialWorld="color" />);
    tick(12000);
    expect(screen.getByRole('button', { name: birthday.decorateSkip })).toBeTruthy();
    click(screen.getByRole('button', { name: 'Add a strawberry' }));
    click(screen.getByRole('button', { name: 'Add a heart' }));
    expect(first.container.querySelectorAll('.sticker')).toHaveLength(2);
    click(screen.getByRole('button', { name: 'Undo' }));
    expect(first.container.querySelectorAll('.sticker')).toHaveLength(1);
    click(screen.getByRole('button', { name: 'Clear' }));
    expect(first.container.querySelectorAll('.sticker')).toHaveLength(0);
    click(screen.getByRole('button', { name: 'Add a star' }));
    expect(screen.getByRole('button', { name: birthday.decorateDone })).toBeTruthy();
    first.unmount();
    const again = render(<App initialPage="cake" initialWorld="color" />);
    tick(12000);
    expect(again.container.querySelectorAll('.sticker')).toHaveLength(1);
    click(screen.getByRole('button', { name: birthday.decorateDone }));
    expect(screen.getByRole('button', { name: birthday.wishButton })).toBeTruthy();
    click(screen.getByRole('button', { name: birthday.decorateAgain }));
    expect(screen.getByRole('button', { name: 'Add a heart' })).toBeTruthy();
  });
});
