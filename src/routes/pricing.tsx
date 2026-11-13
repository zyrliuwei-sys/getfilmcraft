import { createFileRoute, redirect } from '@tanstack/react-router';

// Retired template surface: public visitors belong on the FilmCraft guide.
export const Route = createFileRoute('/pricing')({
  beforeLoad: () => {
    throw redirect({ to: '/', statusCode: 302 });
  },
});
