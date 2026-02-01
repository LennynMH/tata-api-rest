import { TrackingEvent } from '../../domain/entities/tracking-event.entity';

export interface ITrackingEventRepository {
  save(event: TrackingEvent): Promise<TrackingEvent>;
  findByPackageId(packageId: string): Promise<TrackingEvent[]>;
  findById(id: string): Promise<TrackingEvent | null>;
}

export const TRACKING_EVENT_REPOSITORY = Symbol('TRACKING_EVENT_REPOSITORY');
