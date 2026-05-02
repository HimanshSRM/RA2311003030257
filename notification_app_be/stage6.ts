import { Log , setLoggerAuthToken} from "logging_middleware";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoejAwMDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwODI1OCwiaWF0IjoxNzc3NzA3MzU4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTUyMDE5NTQtM2Y4Zi00MTJiLTg2MTItNzEyNGI2MzA1YTlmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaGltYW5zaCIsInN1YiI6Ijc2NzVjOWM3LWMyMDQtNDgzNC1iNjYzLTQ3NzMwYWZlZjNmZCJ9LCJlbWFpbCI6Imh6MDAwM0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6ImhpbWFuc2giLCJyb2xsTm8iOiJyYTIzMTEwMDMwMzAyNTciLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI3Njc1YzljNy1jMjA0LTQ4MzQtYjY2My00NzczMGFmZWYzZmQiLCJjbGllbnRTZWNyZXQiOiJlc3RzSHFreG5jaERBYmt2In0.PhBWxosFjMwOZSey32JTKozXWhw2eBJAWxMtv-kvf4k";

interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

const PRIORITY_WEIGHTS: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function fetchAndSortPriorityInbox(n: number = 10) {
    setLoggerAuthToken(AUTH_TOKEN);

    try {

        const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${AUTH_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        const notifications: Notification[] = data.notifications;

        const sortedNotifications = notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

            if (weightA !== weightB) return weightB - weightA;

            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA; 
        });

        const priorityInbox = sortedNotifications.slice(0, n);

        console.log(`\n=== TOP ${n} PRIORITY INBOX ===\n`);
        priorityInbox.forEach((notif, index) => {
            console.log(`${index + 1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
        });

    } catch (error) {
        console.error("Failed to process priority inbox:", error);
        await Log("backend", "error", "handler", "Failed to fetch and sort notifications.");
    }
}

fetchAndSortPriorityInbox(10);