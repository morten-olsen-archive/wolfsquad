import React, { useState } from 'react';
import { InteractiveMapProps } from 'react-map-gl';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Wallpaper = () => {

  const [{ ReactMapGL }, setReactMapGL] = useState<any>(false);
  const [state, setState] = useState<InteractiveMapProps>({
    width: '100%',
    height: '100%',
    longitude: 12.5935478,
    latitude: 55.6744274,
    pitch: 60,
	  zoom: 12,
  });
  if (ReactMapGL) {
    return (
      <Wrapper>
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1IjoibW9ydGVub2xzZW4iLCJhIjoiY2lpZHBhaTNnMDAweXdlbTBhcTdkcWVnbSJ9.yah6Klt4jMYlkEmpC6PLKQ"
          mapStyle="mapbox://styles/mortenolsen/ciidqy8kt002dbrkm9ai9n9ev"
          {...state}
        />
      </Wrapper>
    );
  } else {
    import('react-map-gl').then(({ default: ReactMapGL }) => {
      setReactMapGL({
        ReactMapGL
      });
    });
    return <div>Hello</div>;
  }
}

export default Wallpaper;