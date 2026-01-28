import { google } from 'googleapis';

interface UserData {
    name: string;
    email: string;
    phone: string;
    date: string;
}

/**
 * Logs user data to a Google Sheet.
 * 
 * @param userData Object containing user details.
 */
export async function logUserToSheet(userData: UserData): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    // Handle newlines in private key which might be escaped in .env
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!spreadsheetId || !clientEmail || !privateKey) {
        throw new Error('Missing Google Sheets credentials in environment variables.');
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const request = {
            spreadsheetId,
            range: 'Sheet1!A:D', // Adjust Sheet name if necessary, appends to columns A-D
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [
                    [userData.name, userData.email, userData.phone, userData.date]
                ],
            },
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log('User logged to sheet, response:', response.status);

    } catch (error) {
        console.error('Error logging user to sheet:', error);
        throw error;
    }
}
