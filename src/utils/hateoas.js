// This module generates HATEOAS links for different resources in the API.

/**
 * Generates HATEOAS links for a given resource and ID.
 *
 * @param {*} resource - The type of resource (e.g., movie, rating, actor). 
 * @param {*} id - The ID of the resource.
 * @returns 
 */
export const generateLinks = (resource, id) => {
  const base = `/api`;

  switch (resource) {
    case "movie":
      return {
        self: { href: `${base}/movies/${id}` },
        ratings: { href: `${base}/movies/${id}/ratings` },
        allMovies: { href: `${base}/movies` }
      };
    case "rating":
      return {
        self: { href: `${base}/ratings/${id}` },
        allRatings: { href: `${base}/ratings` }
      };
    case "actor":
      return {
        self: { href: `${base}/actors/${id}` },
        allActors: { href: `${base}/actors` }
      };
    default:
      return { self: { href: `${base}` } };
  }
};
