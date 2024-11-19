export interface AvailableBooking {
    name: string;
    active: boolean;
    icon: string;
    availableColors: string[];
    availableSizes: string[];
    day: string;
    time: string;
    location: string;
    prizeByUnit: number;
    prize2Units: number;
    url: string;
}