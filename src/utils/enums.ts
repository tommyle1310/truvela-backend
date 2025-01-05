
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

export enum ShiftType {
    MORNING = 'Morning',
    EVENING = 'Evening',
    NIGHT = 'Night', // Example for another shift type, can be extended as needed
}

export enum AttendanceStatus {
    ON_TIME = 'On time',
    LATE = 'Late',
    EARLY = 'Early',
    OVERTIME_EARLY = 'Early check-in',
    OVERTIME_LATE = 'Overtime check-out',
}