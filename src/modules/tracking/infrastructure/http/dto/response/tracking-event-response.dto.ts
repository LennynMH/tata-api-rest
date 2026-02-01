import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingEvent } from '../../../../domain/entities/tracking-event.entity';

export class CoordinatesResponseDto {
  @ApiProperty({ example: -12.0464 })
  lat: number;

  @ApiProperty({ example: -77.0428 })
  lng: number;
}

export class LocationResponseDto {
  @ApiProperty({ example: 'Centro de Distribución Lima, Perú' })
  address: string;

  @ApiPropertyOptional({ type: CoordinatesResponseDto })
  coordinates?: CoordinatesResponseDto;
}

export class TrackingEventResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  packageId: string;

  @ApiProperty({ example: 'location_update' })
  eventType: string;

  @ApiProperty({ type: LocationResponseDto })
  location: LocationResponseDto;

  @ApiProperty({ example: 'en_tránsito' })
  status: string;

  @ApiProperty({ example: 'Paquete recibido en centro de distribución' })
  description: string;

  @ApiPropertyOptional({ example: { carrier: 'DHL', vehicle: 'TRUCK-123' } })
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: '2026-02-01T10:00:00.000Z' })
  eventDate: string;

  @ApiProperty({ example: '2026-02-01T10:00:05.000Z' })
  createdAt: string;

  @ApiPropertyOptional({ example: 'system' })
  createdBy?: string;

  static fromDomain(event: TrackingEvent): TrackingEventResponseDto {
    const dto = new TrackingEventResponseDto();
    dto.id = event.id;
    dto.packageId = event.packageId;
    dto.eventType = event.eventType;
    dto.location = {
      address: event.location.address,
      coordinates: event.location.coordinates,
    };
    dto.status = event.status;
    dto.description = event.description;
    dto.metadata = event.metadata;
    dto.eventDate = event.eventDate.toISOString();
    dto.createdAt = event.createdAt.toISOString();
    dto.createdBy = event.createdBy;
    return dto;
  }
}

export class TrackingHistoryResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  packageId: string;

  @ApiProperty({ example: 5 })
  totalEvents: number;

  @ApiProperty({ type: [TrackingEventResponseDto] })
  events: TrackingEventResponseDto[];

  static fromDomain(packageId: string, events: TrackingEvent[]): TrackingHistoryResponseDto {
    const dto = new TrackingHistoryResponseDto();
    dto.packageId = packageId;
    dto.totalEvents = events.length;
    dto.events = events.map((e) => TrackingEventResponseDto.fromDomain(e));
    return dto;
  }
}
