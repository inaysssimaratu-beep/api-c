import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty({ message: 'Nama harus diisi' })
    readonly name: string;

    @IsNotEmpty({ message: 'Author harus diisi' })
    readonly author: string;

    @IsNotEmpty({ message: 'ISBN harus diisi' })
    readonly isbn: string;

    @IsNotEmpty({ message: 'publishedYear harus diisi' })
    @IsNumber({}, { message: 'publishedYear harus berupa angka' })
    readonly publishedYear: number;
}