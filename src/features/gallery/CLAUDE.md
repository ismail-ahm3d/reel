# gallery

Full-screen photos for a title (backdrops, posters), a person (photos) or an episode (stills), paged, with pinch zoom on iOS.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: GalleryScreen (`app/gallery.tsx`, a full-screen modal over the tabs; source in the params)
- Use cases: getGallery, returned by `makeGallery`
- Error family: none

## Gotchas
- The viewer is black in both schemes (`stage` colour role); its chips use the `onMedia` tone.
