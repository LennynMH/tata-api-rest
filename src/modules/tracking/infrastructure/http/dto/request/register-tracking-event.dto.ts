import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinatesDto {
  @ApiProperty({ example: -12.0464, description: 'Latitud' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -77.0428, description: 'Longitud' })
  @IsNumber()
  lng: number;
}

export class LocationDto {
  @ApiProperty({ example: 'Centro de Distribución Lima, Perú', description: 'Dirección' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ type: CoordinatesDto, description: 'Coordenadas GPS' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

export class RegisterTrackingEventDto {
  @ApiProperty({
    example: 'location_update',
    description: 'Tipo de evento: location_update, status_change, delivery_attempt, etc.',
  })
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @ApiProperty({ type: LocationDto, description: 'Ubicación del evento' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    example: 'en_tránsito',
    description: 'Estado del paquete en el momento del evento',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 'Paquete recibido en centro de distribución',
    description: 'Descripción del evento',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: '2026-02-01T10:00:00Z',
    description: 'Fecha/hora del evento (ISO 8601). Si no se proporciona, se usa la fecha actual.',
  })
  @IsOptional()
  @IsDateString()
  event_date?: string;

  @ApiPropertyOptional({
    example: { carrier: 'DHL', vehicle: 'TRUCK-123' },
    description: 'Metadatos adicionales del evento',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: 'system',
    description: 'Usuario o sistema que registra el evento',
  })
  @IsOptional()
  @IsString()
  created_by?: string;
}
