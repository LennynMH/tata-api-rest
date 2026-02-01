export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  coordinates?: Coordinates;
}

export interface TrackingEventDomain {
  id: string;
  packageId: string;
  eventType: string;
  location: Location;
  status: string;
  description: string;
  metadata?: Record<string, unknown>;
  eventDate: Date;
  createdAt: Date;
  createdBy?: string;
}

export class TrackingEvent implements TrackingEventDomain {
  constructor(
    public readonly id: string,
    public readonly packageId: string,
    public readonly eventType: string,
    public readonly location: Location,
    public readonly status: string,
    public readonly description: string,
    public readonly eventDate: Date,
    public readonly createdAt: Date,
    public readonly metadata?: Record<string, unknown>,
    public readonly createdBy?: string,
  ) {}

  static create(
    id: string,
    packageId: string,
    eventType: string,
    location: Location,
    status: string,
    description: string,
    eventDate: Date,
    metadata?: Record<string, unknown>,
    createdBy?: string,
  ): TrackingEvent {
    return new TrackingEvent(
      id,
      packageId,
      eventType,
      location,
      status,
      description,
      eventDate,
      new Date(),
      metadata,
      createdBy,
    );
  }
}
