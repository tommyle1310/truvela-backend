
export enum Enum_Level {
    INTERN = "Intern",
    JUNIOR = "Junior",
    INTERMEDIATE = "Intermediate",
    SENIOR = "Senior",
    LEAD = "Lead",
    ELITE = "Elite",
    DIRECTOR = "Director",
    VP = "Vice President",
    C_LEVEL = "C-Level"
}

export enum Enum_Job_Type {
    FULL_TIME = 'Full-time',
    PARTTIME = 'Part-time',
    CONTRACT = 'Contract',
}


export enum Enum_Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

export enum Enum_Role {
    CUSTOMER = 'Customer',
    STAFF = 'Staff',
}

export enum Enum_ShiftType {
    MORNING = 'Morning',
    EVENING = 'Evening',
    NIGHT = 'Night', // Example for another shift type, can be extended as needed
}

export enum Enum_AttendanceStatus {
    ON_TIME = 'On time',
    LATE = 'Late',
    EARLY = 'Early',
    OVERTIME_EARLY = 'Early check-in',
    OVERTIME_LATE = 'Overtime check-out',
}

export enum Enum_CandidateStatus {
    APPLIED = 'Applied',
    IN_PROGRESS = 'In progress',
    SELECTED = 'Selected',
    REJECTED = 'Rejected',
}

export enum Enum_DailyStaffAvailabilityStatus {
    OFF = 'Off',
    OCCUPIED = 'Occupied',
    ASSIGNED = 'Assigned'
}

export enum Enum_WeekDays {
    MON = 'mon',
    TUE = 'tue',
    WED = 'wed',
    THU = 'thu',
    FRI = 'fri',
    SAT = 'sat',
    SUN = 'sun',
}

export enum Enum_PayrollStatus {
    PENDING = 'Pending',
    APPROVED = "Approved",
    PAID = "Paid",
    COMPLETED = "Completed",
    ON_HOLD = "On hold"
}


export enum Enum_PayrollAdjustmentType {
    BONUS = 'Bonus',
    REIMBURSEMENT = "Reimbursement",
    OPERATION_DEDUCTION = "Operation deduction",
    OTHER_DEDUCTION = 'Other deduction',
    BENEFIT = 'Benefit',
    TAX = 'Tax'
}