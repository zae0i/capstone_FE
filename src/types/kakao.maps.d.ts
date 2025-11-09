declare global {
  interface Window {
    kakao: any;
  }
}

declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
  }

  interface MarkerOptions {
    map?: Map;
    position: LatLng;
    title?: string;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }

  interface InfoWindowOptions {
    content?: string | HTMLElement;
    disableAutoPan?: boolean;
    map?: Map;
    position?: LatLng;
    removable?: boolean;
    zIndex?: number;
    altitude?: number;
    range?: number;
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    extend(latlng: LatLng): void;
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
    isEmpty(): boolean;
  }

  namespace services {
    class Places {
      constructor(map?: Map);
      keywordSearch(keyword: string, callback: PlacesSearchCB, options?: PlacesSearchOptions): void;
      categorySearch(code: string, callback: PlacesSearchCB, options?: PlacesSearchOptions): void;
    }

    type PlacesSearchCB = (data: PlaceResult[], status: Status, pagination: Pagination) => void;

    interface PlacesSearchOptions {
      location?: LatLng;
      radius?: number;
      bounds?: kakao.maps.LatLngBounds;
      size?: number;
      page?: number;
      sort?: SortBy;
      category_group_code?: CategoryGroupCode;
      rect?: string;
      query?: string;
    }

    enum Status {
      OK, ZERO_RESULT, ERROR
    }

    enum SortBy {
      ACCURACY, DISTANCE
    }

    enum CategoryGroupCode {
      MT1, CS2, PS3, SC4, AC5, PK6, OL7, SW8, BK9, CT1, AG2, PO3, AT4, AD5, FD6, CE7, HP8, PM9
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      category_name: string;
      category_group_code: string;
      category_group_name: string;
      phone: string;
      address_name: string;
      road_address_name: string;
      x: string; // longitude
      y: string; // latitude
      place_url: string;
      distance: string;
    }

    interface Pagination {
      total_count: number;
      pageable_count: number;
      is_end: boolean;
      next_page: () => void;
    }
  }

  function load(callback: () => void): void;
}

export {};
