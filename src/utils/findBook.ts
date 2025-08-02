import { getBibleBooks } from '@/bibleBooks';
import type { BibleBook, Language } from '@/types';

export const findBook = (bookQuery: string, language: Language): BibleBook | BibleBook[] => {
  const trimmedQuery = bookQuery
    .toLowerCase()
    .replace(/[\/.\s\\]/g, '')
    .trim();

  if (!trimmedQuery) {
    console.error('Book query is empty', { bookQuery, trimmedQuery });
    throw new Error('errors.bookNotFound');
  }

  const bibleBooks = getBibleBooks(language);

  if (!bibleBooks) {
    console.error('No bible books found', { bookQuery, trimmedQuery });
    throw new Error('errors.bookNotFound');
  }

  const bookEntries = bibleBooks
    .filter((book) => (!book.prefix ? true : trimmedQuery.match(/^[1-5]/)))
    .filter((book) => {
      const alias = book.aliases.map((alias) => (book.prefix ? `${book.prefix}${alias}` : alias));
      return alias.some((alias) => alias.startsWith(trimmedQuery));
    })
    .map((book) => ({ ...book, idPadded: book.id.toString().padStart(2, '0') }));

  if (bookEntries.length > 1) {
    return bookEntries;
  }

  if (bookEntries.length === 1) {
    return bookEntries[0];
  }

  throw new Error('errors.bookNotFound');
};
