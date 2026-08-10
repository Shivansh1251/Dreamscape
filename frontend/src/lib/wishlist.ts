export type WishlistItem = { name: string; image?: string; savedAt: string };

const KEY = 'dreamscape-wishlist';

export function getWishlist(): WishlistItem[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') as WishlistItem[]; } catch { return []; }
}

export function saveDestination(item: WishlistItem) {
    const items = getWishlist();
    if (!items.some((saved) => saved.name.toLowerCase() === item.name.toLowerCase())) {
        localStorage.setItem(KEY, JSON.stringify([item, ...items]));
        window.dispatchEvent(new Event('wishlist-updated'));
    }
}

export function removeDestination(name: string) {
    localStorage.setItem(KEY, JSON.stringify(getWishlist().filter((item) => item.name !== name)));
    window.dispatchEvent(new Event('wishlist-updated'));
}
