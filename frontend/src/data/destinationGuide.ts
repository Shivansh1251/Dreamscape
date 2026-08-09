export type DestinationGuide = {
    famousFor: string[];
    culture: string;
    food: string[];
    restaurants: string[];
    nightlife: string;
};

const defaultGuide = (place: string): DestinationGuide => ({
    famousFor: [`A memorable local food scene`, `Neighbourhood walks and photo spots`, `Culture shaped by ${place}'s people`],
    culture: `Look for local music, galleries, seasonal celebrations, and small performances while you explore ${place}.`,
    food: ['A regional signature dish', 'A neighbourhood café', 'A local market or food hall'],
    restaurants: ['Ask your hotel for a favourite local table', 'Look for busy, well-reviewed neighbourhood restaurants', 'Try a chef-led tasting menu for a special evening'],
    nightlife: `Start with a relaxed bar or live-music venue, then follow the local pace for an easy night out in ${place}.`,
});

const guides: Record<string, DestinationGuide> = {
    spain: {
        famousFor: ['Flamenco, fiestas, and late-night energy', 'Gaudí architecture and Mediterranean coastlines', 'Tapas culture, markets, and long shared meals'],
        culture: 'Catch a flamenco performance, a neighbourhood festival, or an outdoor film and let the city set the rhythm for your evening.',
        food: ['Patatas bravas and croquetas', 'Paella by the coast', 'Churros with hot chocolate'],
        restaurants: ['Book a tapas bar in Madrid or Seville', 'Try a market lunch in Barcelona', 'Choose a rooftop table for sunset drinks'],
        nightlife: 'Spain is made for long evenings: begin with tapas, find a live-music or flamenco venue, and finish at a rooftop or local bar.',
    },
    italy: {
        famousFor: ['Renaissance art and cinematic cities', 'Regional pasta, espresso, and aperitivo', 'Small piazzas, coastlines, and slow evenings'],
        culture: 'Look for opera, outdoor cinema, local design exhibitions, and traditional street celebrations.',
        food: ['Fresh pasta in its regional style', 'Gelato from a local gelateria', 'Aperitivo with small plates'],
        restaurants: ['Reserve a family-run trattoria', 'Try a market-to-table lunch', 'Visit a neighbourhood wine bar'],
        nightlife: 'Enjoy aperitivo at golden hour, then explore a piazza or intimate live-music spot.',
    },
    goa: {
        famousFor: ['Palm-lined beaches and relaxed sunsets', 'Indo-Portuguese architecture and heritage', 'Seafood, markets, and beachside music'],
        culture: 'Discover local art, heritage walks, beach music nights, and creative pop-ups.',
        food: ['Goan fish curry rice', 'Prawn balchão', 'Bebinca for dessert'],
        restaurants: ['Choose a beach shack for fresh seafood', 'Try a heritage neighbourhood café', 'Book a sunset table by the water'],
        nightlife: 'Sunset sessions, beachside live music, and relaxed dance floors make for a memorable Goan evening.',
    },
};

export function getDestinationGuide(name: string) {
    return guides[name.toLowerCase()] || defaultGuide(name);
}
