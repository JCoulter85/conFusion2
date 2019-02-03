export class Comment {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agree: boolean;
    contacttype: string;
    message: string;
    comment: string;
    newDate = new Date();
}

export const ContactType = ['None', 'Tel', 'Email'];