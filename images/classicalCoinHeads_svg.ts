/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="m32.16 93.84 11.13-11.4c-3.96-.86-7.64-2.42-10.93-4.54l-.19 15.94ZM68.52 6.07l-11.13 11.4c3.96.86 7.64 2.42 10.93 4.55l.19-15.94ZM17.85 57.01 6.45 68.13l15.94-.19a33 33 0 0 1-4.54-10.93m64.97-14.1 11.4-11.13-15.94.19a33.2 33.2 0 0 1 4.55 10.93ZM22.4 31.97l-15.94-.19 11.4 11.13a33 33 0 0 1 4.55-10.93Zm55.88 35.97 15.94.19-11.4-11.12c-.86 3.95-2.42 7.64-4.55 10.93ZM43.29 17.47 32.17 6.07l.19 15.94c3.29-2.12 6.98-3.69 10.93-4.54m14.1 64.97 11.13 11.4-.19-15.94a33 33 0 0 1-10.93 4.54ZM23.03 68.9l-6.28 14.65 14.65-6.28c-3.26-2.27-6.1-5.11-8.37-8.37m54.62-37.88 6.28-14.65-14.65 6.28c3.26 2.27 6.1 5.11 8.37 8.37M17.09 49.96c0-2.02.21-4 .56-5.92L2.84 49.96l14.81 5.92c-.35-1.92-.56-3.9-.56-5.92m80.75 0-14.81-5.92c.35 1.93.56 3.9.56 5.92s-.21 4-.56 5.92zM31.4 22.65l-14.65-6.28 6.28 14.65c2.27-3.26 5.1-6.1 8.37-8.37m37.88 54.62 14.65 6.28-6.28-14.65c-2.27 3.26-5.1 6.1-8.37 8.37M56.26 17.26 50.34 2.45l-5.92 14.81c1.93-.35 3.9-.56 5.92-.56s4 .21 5.92.56M44.41 82.65l5.92 14.81 5.92-14.81c-1.93.35-3.9.56-5.92.56s-3.99-.21-5.92-.56"/><path d="M50.34 80.9c-17.06 0-30.95-13.88-30.95-30.95S33.27 19 50.34 19s30.95 13.88 30.95 30.95S67.41 80.9 50.34 80.9m0-60.16c-16.11 0-29.22 13.11-29.22 29.22s13.11 29.22 29.22 29.22 29.22-13.11 29.22-29.22-13.11-29.22-29.22-29.22m0 47.64c-7.11 0-12.18-4.18-14.55-8.09-.55-.91-.46-2 .23-2.65.6-.56 1.46-.6 2.19-.09 7.82 5.46 16.43 5.46 24.25 0 .73-.51 1.59-.47 2.19.09.69.65.79 1.74.23 2.65-2.37 3.91-7.44 8.09-14.55 8.09Zm-4.41-18.47c-.36 0-.7-.14-.96-.41-1.51-1.59-3.39-2.4-5.6-2.4s-4.09.81-5.6 2.4c-.47.49-1.19.55-1.82.15-.63-.39-1.15-1.22-.88-1.98 1.91-5.25 4.93-8.26 8.29-8.26s6.38 3.01 8.29 8.26c.28.77-.25 1.59-.88 1.99-.28.17-.57.26-.86.26Zm8.81 0c-.28 0-.57-.09-.85-.26-.63-.39-1.16-1.22-.88-1.98 1.91-5.25 4.93-8.26 8.29-8.26s6.39 3.01 8.3 8.26c.27.77-.25 1.6-.88 1.99s-1.35.33-1.81-.15c-1.51-1.59-3.39-2.4-5.6-2.4s-4.09.81-5.6 2.4c-.26.27-.6.41-.96.41Z"/></svg>')}`;
export default image;