import { z } from "zod" // ensure the same version of Zod is used


// Define Nested Schemas first
// UserRead
const UserReadSchema = z.object({
    id: z.int(),
    email: z.email(),
    created_at: z.coerce.date()
});


// TokenResponse
const TokenResponseSchema = z.object({
    access_token: z.string(),
    token_type: z.enum(["bearer"]),
    user: UserReadSchema
});

// Export Schemas
export const Schemas = {
    // ProfileCreate
    ProfileCreateSchema: z.object({
        name: z.string().trim().min(3).max(20)
    }),


    // ProfileRead
    ProfileReadSchema: z.object({
        id: z.int(),
        user_id: z.int(),
        name: z.string(),
        created_at: z.coerce.date()
    }),


    // ExperienceCreate
    ExperienceCreateSchema: z.object({
        title: z.string().trim().max(50).optional(),
        organization: z.string().trim().max(50).optional(),
        location: z.string().trim().max(50).optional(),
        kind: z.enum(['school', 'work', 'side_project']),
        start_date: z.coerce.date(),
        end_date: z.coerce.date().optional()
    }),


    // ExperienceRead
    ExperienceReadSchema: z.object({
        id: z.int(),
        profile_id: z.int(),
        title: z.string().nullable().optional(),
        organization: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        kind: z.enum(['school', 'work', 'side_project']),
        start_date: z.coerce.date(),
        end_date: z.coerce.date().nullable().optional()
    }),


    // BulletCreate
    BulletCreateSchema: z.object({
        body: z.string().trim().min(1).max(300),
        sort_order: z.int().default(0)
    }),


    // BulletRead
    BulletReadSchema: z.object({
        id: z.int(),
        experience_id: z.int(),
        body: z.string(),
        sort_order: z.int()
    }),


    // EduDetailCreate
    EduDetailCreateSchema: z.object({
        degree: z.string().trim().min(1).max(30),
        major: z.string().trim().max(30).optional(),
        gpa: z.coerce.number().min(0).max(4).optional(),
    }),


    // EduDetailRead
    EduDetailReadSchema: z.object({
        experience_id: z.int(),
        degree: z.string(),
        major: z.string().optional(),
        gpa: z.coerce.number().min(0).max(4).optional(),
    }),


    // CourseCreate
    CourseCreateSchema: z.object({
        name: z.string().trim().min(1).max(30),
        code: z.string().trim().max(15).optional(),
        sort_order: z.int().default(0)
    }),


    // CourseRead
    CourseReadSchema: z.object({
        id: z.int(),
        experience_id: z.int(),
        name: z.string(),
        code: z.string().optional(),
        sort_order: z.int()
    }),


    // SkillCreate
    SkillCreateSchema: z.object({
        name: z.string().trim().min(1).max(30),
        category: z.enum(["technical", "soft", "interest"]),
    }),


    // SkillRead
    SkillReadSchema: z.object({
        id: z.int(),
        profile_id: z.int(),
        name: z.string(),
        category: z.enum(["technical", "soft", "interest"]),
    }),


    // UserRegister
    UserRegisterSchema: z.object({
        email: z.email(),
        password: z.string().trim().min(6)
    }),


    // UserLogin
    UserLoginSchema: z.object({
        email: z.email(),
        password: z.string().trim().min(6)
    }),

    // Nested Schemas
    UserReadSchema,
    TokenResponseSchema,
} as const;


export type SchemaTypes = {
    [K in keyof typeof Schemas]: z.infer<typeof Schemas[K]>;
};


export type ProfileCreate = SchemaTypes['ProfileCreateSchema'];
export type ProfileRead = SchemaTypes['ProfileReadSchema'];
export type ExperienceCreate = SchemaTypes['ExperienceCreateSchema'];
export type ExperienceRead = SchemaTypes['ExperienceReadSchema'];
export type BulletCreate = SchemaTypes['BulletCreateSchema'];
export type BulletRead = SchemaTypes['BulletReadSchema'];
export type EduDetailCreate = SchemaTypes['EduDetailCreateSchema'];
export type EduDetailRead = SchemaTypes['EduDetailReadSchema'];
export type CourseCreate = SchemaTypes['CourseCreateSchema'];
export type CourseRead = SchemaTypes['CourseReadSchema'];
export type SkillCreate = SchemaTypes['SkillCreateSchema'];
export type SkillRead = SchemaTypes['SkillReadSchema'];
export type UserRegister = SchemaTypes['UserRegisterSchema'];
export type UserLogin = SchemaTypes['UserLoginSchema'];
export type UserRead = SchemaTypes['UserReadSchema'];
export type TokenResponse = SchemaTypes['TokenResponseSchema'];
