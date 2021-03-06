import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MusickitConfig } from '../musickit-config/musickit-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, retryWhen, timeout } from 'rxjs/operators';
// import { SongModel } from '../../../@types/song-model';
// import { AlbumModel } from '../../../@types/album-model';

@Injectable({
  providedIn: 'root'
})
export class MusickitService {
  constructor(
    private musicKitService: MusickitConfig,
    private http: HttpClient
  ) {}

  API_URL = 'https://api.music.apple.com';

  getApiHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.musicKitService.musicKit.developerToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Music-User-Token': this.musicKitService.musicKit.musicUserToken
    });
  }

  fetchLibrarySongs(offset: number): Observable<any> {
    return from(this.musicKitService.musicKit.api.library.songs(null, { limit: 100, offset: offset }));
  }

  fetchLibraryAlbums(offset: number): Observable<any> {
    return from(this.musicKitService.musicKit.api.library.albums(null, { limit: 100, offset: offset }));
  }

  fetchLibraryAlbum(id: string): Observable<any> {
    return from(this.musicKitService.musicKit.api.library.album(id));
  }

  fetchAlbum(id: string): Observable<any> {
    return from(this.musicKitService.musicKit.api.album(id));
  }

  fetchLibraryArtists(offset: number): Observable<any> {
    return from(
      this.musicKitService.musicKit.api.library.artists(null, {
        limit: 100,
        offset: offset
      })
    );
  }

  fetchLibraryArtist(id: string): Observable<any> {
    return from(
      this.musicKitService.musicKit.api.library.artist(id, {
        include: 'albums'
      })
    );
  }

  fetchArtist(id: string): Observable<any> {
    return from(
      this.musicKitService.musicKit.api.artist(id, {
        include: 'playlists,albums',
        offset: '26'
      })
    );
  }

  search(query: string): Observable<any> {
    const searchTypes = ['songs', 'albums', 'artists', 'playlists'];
    return from(
      this.musicKitService.musicKit.api.search(query, {
        types: searchTypes,
        limit: 50
      })
    ).pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  searchLibrary(query: string): Observable<any> {
    const searchTypes = [
      'library-songs',
      'library-albums',
      'library-artists',
      'library-playlists'
    ];
    return from(
      this.musicKitService.musicKit.api.library.search(query, {
        types: searchTypes,
        limit: 20
      })
    );
  }

  fetchPlaylists(offset: number): Observable<any> {
    return from(
      this.musicKitService.musicKit.api.library.playlists(null, {
        limit: 100,
        offset: offset
      })
    ).pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  fetchLibraryPlaylist(id: string): Observable<any> {
    return from(this.musicKitService.musicKit.api.library.playlist(id));
  }

  fetchPlaylist(id: string): Observable<any> {
    return from(this.musicKitService.musicKit.api.playlist(id));
  }

  fetchPlaylistTracks(nextUrl: string): Observable<any> {
    return this.http.get(this.API_URL + nextUrl, {
      headers: this.getApiHeaders()
    });
  }

  fetchRecentlyAdded(offset: number): Observable<any> {
    return from(
      this.musicKitService.musicKit.api.library.collection(
        'recently-added',
        null,
        { limit: 10, offset: offset }
      )
    );
  }

  fetchRecommendations(): Observable<any> {
    return from(this.musicKitService.musicKit.api.recommendations());
  }

  fetchRecentPlayed(): Observable<any> {
    return from(this.musicKitService.musicKit.api.recentPlayed());
  }

  fetchHeavyRotation(): Observable<any> {
    return from(this.musicKitService.musicKit.api.historyHeavyRotation());
  }

  fetchChart(): Observable<any> {
    const searchTypes = ['songs', 'albums', 'playlists'];
    return from(
      this.musicKitService.musicKit.api.charts(null, {
        types: searchTypes,
        limit: 10
      })
    );
  }
}
