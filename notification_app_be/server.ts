import express, { Request, Response } from 'express';
import { Log, setLoggerAuthToken } from "logging_middleware";

const app = express();
app.use(express.json());

const PORT = 3001;
// Replace with your current valid token for testing
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

/**
 * @route   POST /api/sort-notifications
 * @desc    Accepts a list of notifications and returns the Top 10 by priority
 */
app.post('/api/sort-notifications', async (req: Request, res: Response) => {
    setLoggerAuthToken(AUTH_TOKEN);
    const { notifications }: { notifications: Notification[] } = req.body;

    if (!notifications || !Array.isArray(notifications)) {
        await Log("backend", "error", "handler", "Invalid notifications array received.");
        return res.status(400).json({ error: "Invalid input. Expected an array of notifications." });
    }

    try {
        await Log("backend", "info", "handler", "Processing priority sorting for API request.");

        // Stage 6 Sorting Logic: Weight (Type) > Recency (Timestamp)
        const sorted = notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

            if (weightA !== weightB) return weightB - weightA;

            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA;
        });

        const top10 = sorted.slice(0, 10);

        await Log("backend", "info", "handler", "Successfully returned top 10 priority notifications.");
        res.json({
            success: true,
            count: top10.length,
            data: top10
        });

    } catch (error) {
        await Log("backend", "error", "handler", "Critical failure during notification sorting.");
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Backend Server running at http://localhost:${PORT}`);
    console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/sort-notifications\n`);
});