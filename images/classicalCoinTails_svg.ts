/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M68.36 14.47a38.4 38.4 0 0 1 6.58 21.52c0 21.45-17.58 38.84-39.26 38.84-7.37 0-14.26-2.01-20.15-5.5 6.69 13.17 20.46 22.2 36.37 22.2 22.47 0 40.69-18.02 40.69-40.25 0-16.43-9.96-30.55-24.22-36.81Z" style="fill:#c0c"/></svg>')}`;
export default image;