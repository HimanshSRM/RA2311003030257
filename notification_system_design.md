# Campus Notifications Microservice Architecture

## Stage 1
**REST API Design & Contract**
**1. Fetch Notifications**
*   **Endpoint:** `GET /api/v1/notifications`
*   **Headers:** `Authorization: Bearer <token>`
*   **Query Params:** `?page=1&limit=20&status=unread`
*   **Response (200 OK):**
    
```json
    {
      "data": [
        { "id": "uuid", "type": "Placement", "message": "CSX Corporation hiring", "isRead": false, "createdAt": "2026-04-22T17:51:18Z" }
      ],
      "pagination": { "currentPage": 1, "totalPages": 5 }
    }
    ```

**2. Mark Notification as Read**
*   **Endpoint:** `PATCH /api/v1/notifications/:id/read`
*   **Headers:** `Authorization: Bearer <token>`
*   **Response (200 OK):** `{ "message": "Notification marked as read" }`

**Real-Time Mechanism**
For real-time delivery, **Server-Sent Events (SSE)** is the recommended approach. It is much more lightweight and easier to scale over HTTP/2 compared to WebSockets for unidirectional data flow.

## Stage 2
**Persistent Storage Strategy**
I suggest **PostgreSQL**. While NoSQL offers flexible schemas, notifications require strong consistency, highly structured relationships (joining users to notifications), and complex filtering (by type, date, and read status).

**Database Schema**
*   **Table: notifications**
    *   `id` (UUID, Primary Key)
    *   `student_id` (Integer, Foreign Key, Indexed)
    *   `type` (Enum: 'Placement', 'Result', 'Event', Indexed)
    *   `message` (Text)
    *   `is_read` (Boolean, Default: false, Indexed)
    *   `created_at` (Timestamp, Default: NOW(), Indexed)

**Scaling Problems & Solutions**
As data volume increases, write speeds will degrade.
*   **Solution 1 (Archiving):** Move notifications older than 30 days to cold storage (e.g., AWS S3).
*   **Solution 2 (Read Replicas):** Route all `GET` requests to follower databases.

**Sample SQL Queries**
*   *Insert:* `INSERT INTO notifications (student_id, type, message) VALUES (1042, 'Event', 'tech-fest');`
*   *Fetch:* `SELECT * FROM notifications WHERE student_id = 1042 ORDER BY created_at DESC LIMIT 20;`

## Stage 3
**Query Analysis**
The query `SELECT * FROM notifications WHERE studentID = 1042 AND isRead = false ORDER BY createdAt DESC;` is performing slowly because it triggers a **Full Table Scan** without a composite index.

**Optimizations & Costs**
1.  **Stop using `SELECT *`:** Select only required fields.
2.  **Add a Composite Index:** `CREATE INDEX idx_student_unread ON notifications (studentID, isRead, createdAt DESC);`
*   *Computation Cost:* Reduces time complexity from O(N) to O(log N). 

**Indexing Every Column?**
This is ineffective. Indexes consume disk space, and rebuilding them on every insert/update massively slows down write operations.

**Optimized Enum Query**
```sql
SELECT id, notification_type, message, created_at 
FROM notifications 
WHERE student_id = 1042 
  AND notification_type IN ('Event', 'Result', 'Placement') 
  AND created_at >= NOW() - INTERVAL '7 days';