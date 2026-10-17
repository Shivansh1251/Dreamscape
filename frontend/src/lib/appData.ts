export interface TripPlan {
    id: string;
    destination: string;
    days: number;
    budget: string;
    travelers: number;
    interests: string[];
    travelStyle: string;
    startDate?: string;
    createdAt: string;
    status: 'planned' | 'completed';
    itinerary?: {
        summary?: string;
        budgetBreakdown?: { total?: string };
        days?: Array<{ day: number; title: string }>;
    };
}

export interface RoamieConnection {
    id: string;
    name: string;
    handle: string;
    city: string;
    interests: string[];
    bio: string;
    avatar: string;
    connectedAt: string;
}

export interface SavedProfile {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
}

export interface AppSettings {
    emailNotifications: boolean;
    tripReminders: boolean;
    homeCity: string;
}

const TRIPS_KEY = 'dreamscapes-trips';
const CONNECTIONS_KEY = 'dreamscapes-roamie-connections';
const PROFILE_KEY = 'dreamscapes-profile';
const SETTINGS_KEY = 'dreamscapes-settings';
const ACTIVITY_KEY = 'dreamscapes-activity';
const DATA_EVENT = 'dreamscapes-data-changed';

function read<T>(key: string, fallback: T): T {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) as T : fallback;
    } catch {
        return fallback;
    }
}

function write<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(DATA_EVENT));
}

function id(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function onAppDataChange(listener: () => void) {
    window.addEventListener(DATA_EVENT, listener);
    window.addEventListener('storage', listener);
    return () => {
        window.removeEventListener(DATA_EVENT, listener);
        window.removeEventListener('storage', listener);
    };
}

export function getTrips() {
    return read<TripPlan[]>(TRIPS_KEY, []);
}

export function saveTrip(input: Omit<TripPlan, 'id' | 'createdAt' | 'status'>) {
    const trip: TripPlan = { ...input, id: id('trip'), createdAt: new Date().toISOString(), status: 'planned' };
    write(TRIPS_KEY, [trip, ...getTrips()]);
    addActivity(`Created a ${trip.days}-day trip to ${trip.destination}`);
    return trip;
}

export function updateTrip(id: string, update: Partial<Pick<TripPlan, 'status'>>) {
    const trips = getTrips().map(trip => trip.id === id ? { ...trip, ...update } : trip);
    write(TRIPS_KEY, trips);
    const trip = trips.find(item => item.id === id);
    if (trip && update.status) addActivity(`${update.status === 'completed' ? 'Completed' : 'Reopened'} the ${trip.destination} trip`);
}

export function deleteTrip(id: string) {
    const trip = getTrips().find(item => item.id === id);
    write(TRIPS_KEY, getTrips().filter(item => item.id !== id));
    if (trip) addActivity(`Removed the ${trip.destination} trip`);
}

export function getConnections() {
    return read<RoamieConnection[]>(CONNECTIONS_KEY, []);
}

export function connectRoamie(roamie: Omit<RoamieConnection, 'connectedAt'>) {
    const existing = getConnections();
    if (existing.some(connection => connection.id === roamie.id)) return;
    write(CONNECTIONS_KEY, [{ ...roamie, connectedAt: new Date().toISOString() }, ...existing]);
    addActivity(`Connected with ${roamie.name} on Roamies`);
}

export function disconnectRoamie(id: string) {
    const roamie = getConnections().find(connection => connection.id === id);
    write(CONNECTIONS_KEY, getConnections().filter(connection => connection.id !== id));
    if (roamie) addActivity(`Removed ${roamie.name} from Roamies connections`);
}

export function getProfile(fallback: SavedProfile): SavedProfile {
    return { ...fallback, ...read<Partial<SavedProfile>>(PROFILE_KEY, {}) };
}

export function saveProfile(profile: SavedProfile) {
    write(PROFILE_KEY, profile);
    addActivity('Updated profile details');
}

export function getSettings(): AppSettings {
    return { emailNotifications: true, tripReminders: true, homeCity: '', ...read<Partial<AppSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: AppSettings) {
    write(SETTINGS_KEY, settings);
    addActivity('Saved account settings');
}

export function getActivity() {
    return read<string[]>(ACTIVITY_KEY, []);
}

export function addActivity(message: string) {
    const entry = `${new Date().toLocaleString()} — ${message}`;
    const activity = [entry, ...getActivity()].slice(0, 30);
    write(ACTIVITY_KEY, activity);
}
