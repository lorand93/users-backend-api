import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({description: 'Auto generated id', example: '5'})
  id: string;

  @Column()
  @ApiProperty({description: 'Email of user', example: 'mike.millers@email.com'})
  email: string;

  @Column()
  @ApiProperty({description: 'Given name of user', example: 'mike'})
  givenName: string;

  @Column()
  @ApiProperty({description: 'Family name of user', example: 'Millers'})
  familyName: string;

  @Column()
  @ApiProperty({description: 'User creation timestamp', example: 165774})
  created: number;
}
