import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { GalleryUseCases } from '@features/gallery/domain/usecases/galleryUseCases';
import { makeGetGallery } from '@features/gallery/domain/usecases/getGallery';
import { makeGalleryRemoteDataSource } from '@features/gallery/data/datasources/remote/galleryRemoteDataSource';
import { makeGalleryRepository } from '@features/gallery/data/repositories/galleryRepositoryImpl';

export const makeGallery = ({ http, language }: { http: HttpClient; language: string }): GalleryUseCases => ({
  getGallery: makeGetGallery({
    gallery: makeGalleryRepository({ remote: makeGalleryRemoteDataSource({ http, language }) }),
  }),
});
