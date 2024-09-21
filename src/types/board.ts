export const colorTicket: { [key: string]: string } = {
    "Aquamarine": "#55FBAF",
    "Red": '#FF4F4F',
    "SkyBlue": '#4FDBFF',
    "Yellow": '#FFD350',
    "Purple": '#A84FFF',
    "Pink": '#FB3463'
};

export interface Image {
    imgUrl: string;
    accessUri: string;
    authenticateId: string;
};

export interface ticketRequest {
    departure: string;
    departureCode: string;
    destination: string;
    destinationCode: string;
    endDate: string;
    id: number;
    image: Image[];
    memberNum: number;
    startDate: string;
    ticketColor: string;
    transport: string;
};

export interface PostResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
        ticket: ticketRequest;
        post: {
            id: number;
            email: string;
            title: string;
            body: string;
            postType: string;
            location: string;
            images: Image[];
            tags: string[];
            likeCount: number;
        };
    };
};