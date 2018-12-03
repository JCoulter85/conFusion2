export class Feedback {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agree: boolean;
    contacttype: string;
    message: string;
    comment: string;
};

export const ContactType = ['None', 'Tel', 'Email'];