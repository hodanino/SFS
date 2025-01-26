import { IsEmail, IsString, Matches, MinLength, IsIn, IsOptional } from 'class-validator';

export class RegisterUserDto {
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

    @IsString({ message: 'Excel name must be a string' })
    @MinLength(3, { message: 'Excel name must be at least 3 characters long' })
    excelName: string;

    @IsString({ message: 'Role must be a string' })
    @IsIn(['admin', 'investor'], { message: 'Role must be either "admin" or "investor"' })
    role: string;

    @IsOptional() // Allow this field to be optional in case it is not required for all users
    @IsString({ message: 'Spreadsheet ID must be a string' })
    spreadsheetId: string;
}
