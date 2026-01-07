export interface ImagePlaceholder {
    imageUrl: string;
    description: string;
    imageHint: string;
}

export const placeholderImages: ImagePlaceholder[] = [
    { imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600', description: 'Romantic Couple', imageHint: 'couple love' },
    { imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600', description: 'Couple holding hands', imageHint: 'couple hands' },
    { imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600', description: 'Couple laughing', imageHint: 'couple fun' },
    { imageUrl: 'https://images.unsplash.com/photo-1494774155065-646be4b069ed?q=80&w=600', description: 'Intimate moment', imageHint: 'couple sexy' },
    { imageUrl: 'https://images.unsplash.com/photo-1621090332822-261882d41b55?q=80&w=600', description: 'Adventure', imageHint: 'couple adventurous' },
];
