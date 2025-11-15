'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import { useState } from 'react';
import MapboxMap, { Marker, Popup } from 'react-map-gl/mapbox';

import type { MerchantDetail } from '@/lib/types/merchant';

export function InteractiveMap({
  mapboxAccessToken,
  merchant,
}: {
  mapboxAccessToken: string | undefined;
  merchant: MerchantDetail;
}) {
  const [popupInfo, setPopupInfo] = useState<MerchantDetail | null>(null);

  return (
    <MapboxMap
      initialViewState={{
        longitude: merchant.longitude,
        latitude: merchant.latitude,
        zoom: 19,
      }}
      mapboxAccessToken={mapboxAccessToken}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ height: '100vh' }}
    >
      <Marker
        anchor="bottom"
        latitude={merchant.latitude}
        longitude={merchant.longitude}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo(merchant);
        }}
      />
      {popupInfo && (
        <Popup
          anchor="top"
          latitude={Number(popupInfo.latitude)}
          longitude={Number(popupInfo.longitude)}
          onClose={() => setPopupInfo(null)}
        >
          <figure className="flex flex-col gap-2 bg-popover p-2 text-foreground">
            <figcaption>
              {popupInfo.display_name} |{' '}
              <a
                className="text-primary"
                href={`https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Maps
              </a>
            </figcaption>
            {popupInfo.photo_url &&
              popupInfo.photo_width &&
              popupInfo.photo_height &&
              popupInfo.photo_blur_data_url && (
                <Image
                  alt={popupInfo.display_name || popupInfo.name}
                  blurDataURL={popupInfo.photo_blur_data_url}
                  height={popupInfo.photo_height}
                  placeholder="blur"
                  src={popupInfo.photo_url}
                  width={popupInfo.photo_width}
                />
              )}
            <address>{popupInfo.formatted_address}</address>
          </figure>
        </Popup>
      )}
    </MapboxMap>
  );
}
