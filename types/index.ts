export interface CustomEnv {
    userPoolId: string;
}

export interface Profile {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: Address;
}

export interface Address {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    postcode: string;
}

export interface Listing {
    title: string;
    description: string;
    askingForMin: number;
    askingForMax: number;
    comments: Comment[];
    offers: Offer[];
    media: string[];
    profile: Profile;
}

export interface Comment {
    message: string;
    profile: Profile;
    postedAt: Date;
}

export interface Offer extends Comment {
    offer: number;
}
