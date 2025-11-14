# Interview Status Fix

## Problem Identified

Interviews with a 0% score were still showing as "Pending" instead of being marked as "completed" or "failed".

## Root Cause

The `handleInterviewComplete` function always set the status to `'completed'` regardless of the score. Failed interviews (score = 0) should have `status: 'failed'`, not `'completed'`.

## Solution Implemented

### 1. Dynamic Status Assignment
**File**: `apps/web/src/app/interview/[id]/page.tsx` (line 75-95)

**Before**:
```typescript
const handleInterviewComplete = async (score, feedback, earnings) => {
    await updateInterview({
        status: 'completed',  // Always completed, even for 0% scores
        score,
        feedback,
        earnings
    });
};
```

**After**:
```typescript
const handleInterviewComplete = async (score, feedback, earnings) => {
    // Determine status based on score
    const status = score === 0 ? 'failed' : 'completed';
    
    await updateInterview({
        status: status,  // Dynamic status based on score
        score,
        feedback,
        earnings
    });
};
```

### 2. Display Logic Update
**File**: `apps/web/src/components/tabs/interview/interview-history.tsx` (line 89-112)

**Before**:
```typescript
{interview.status === 'completed' && interview.score ? (
    // Show score
) : (
    // Show "Pending" for everything else
)}
```

**After**:
```typescript
{interview.status === 'completed' && interview.score !== undefined ? (
    // Show score and earnings
) : interview.status === 'failed' ? (
    // Show "0% - Failed" in red
) : (
    // Show status (In Progress, Grading, Not Started)
)}
```

### 3. Visual Indicators
- **Failed interviews**: Red icon with X mark
- **Completed interviews**: Green checkmark
- **In Progress**: Blue target icon
- **Grading**: Yellow spinner

## Status Flow

```
Interview Ends
    ↓
Grading Screen
    ↓
Score Calculated
    ↓
┌────────────────────┐
│  Check Score       │
├────────────────────┤
│  Score = 0?        │
│    → 'failed'      │
│  Score > 0?        │
│    → 'completed'   │
└────────────────────┘
    ↓
Update Database
    ↓
Display Correct Status
```

## Result

### Before
- 0% score → Status: "Pending" ❌
- No clear indication of failed interviews
- Same display for pending and failed

### After
- 0% score → Status: "Failed" ✅
- Red indicator with X icon
- Clear "0% - Failed" display
- Proper status for all interview outcomes

## Status Types

1. **not_started**: Interview created but not started
2. **in_progress**: Interview currently happening
3. **grading**: Interview ended, grading in progress
4. **completed**: Interview finished with score > 0
5. **failed**: Interview finished with score = 0

Now interviews are properly categorized based on their outcome!
