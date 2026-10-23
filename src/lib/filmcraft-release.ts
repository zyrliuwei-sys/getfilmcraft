import { createServerFn } from '@tanstack/react-start';

/**
 * Latest FilmCraft release for route loaders. Runs on the server (the
 * module import stays out of the client bundle) and is cached there.
 */
export const getFilmcraftRelease = createServerFn().handler(async () => {
  const { getLatestFilmcraftRelease } =
    await import('@/modules/filmcraft-release/service');
  return getLatestFilmcraftRelease();
});
