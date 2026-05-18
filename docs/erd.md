# Database ERD

```mermaid
erDiagram
    User {
        Int id PK
        String email UK
        String password
        DateTime createdAt
        DateTime updatedAt
    }

    DailySchedule {
        Int id PK
        DateTime date
        Int userId FK
        DateTime createdAt
    }

    BigThree {
        Int id PK
        String content
        Int order
        Boolean completed
        DateTime createdAt
        DateTime updatedAt
        Int scheduleId FK
    }

    BrainDump {
        Int id PK
        String content
        DateTime createdAt
        DateTime updatedAt
        Int scheduleId FK
    }

    TimeBox {
        Int id PK
        Int hour
        Boolean isFirstHalf
        String content
        DateTime createdAt
        DateTime updatedAt
        Int scheduleId FK
    }

    User ||--o{ DailySchedule : "has"
    DailySchedule ||--o{ BigThree : "has"
    DailySchedule ||--o{ BrainDump : "has"
    DailySchedule ||--o{ TimeBox : "has"
```

## Unique Constraints

| Table | Constraint |
|-------|------------|
| `DailySchedule` | `(userId, date)` — 유저당 날짜 하나 |
| `BigThree` | `(scheduleId, order)` — 스케줄당 순서 중복 불가 |
| `TimeBox` | `(scheduleId, hour, isFirstHalf)` — 스케줄당 30분 슬롯 하나 |

## Cascade Rules

모든 자식 테이블(`DailySchedule`, `BigThree`, `BrainDump`, `TimeBox`)은 부모 삭제 시 `onDelete: Cascade` 적용.
