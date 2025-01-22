import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z]).+$/, {
        message: 'Password must contain at least one uppercase and one lowercase letter',
    })
    password: string;
}
