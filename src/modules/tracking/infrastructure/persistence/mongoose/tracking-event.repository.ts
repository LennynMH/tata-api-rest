import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITrackingEventRepository } from '../../../application/ports/tracking-event.repository.port';
import { TrackingEvent, Location } from '../../../domain/entities/tracking-event.entity';
import { TrackingEventDocument } from './tracking-event.schema';

@Injectable()
export class MongoTrackingEventRepository implements ITrackingEventRepository {
  constructor(
    @InjectModel(TrackingEventDocument.name)
    private readonly trackingEventModel: Model<TrackingEventDocument>,
  ) {}

  async save(event: TrackingEvent): Promise<TrackingEvent> {
    const document = new this.trackingEventModel({
      id: event.id,
      packageId: event.packageId,
      eventType: event.eventType,
      location: event.location,
      status: event.status,
      description: event.description,
      metadata: event.metadata,
      eventDate: event.eventDate,
      createdBy: event.createdBy,
    });

    await document.save();
    return this.toDomain(document);
  }

  async findByPackageId(packageId: string): Promise<TrackingEvent[]> {
    const documents = await this.trackingEventModel
      .find({ packageId })
      .sort({ eventDate: -1 })
      .exec();

    return documents.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<TrackingEvent | null> {
    const document = await this.trackingEventModel.findOne({ id }).exec();
    return document ? this.toDomain(document) : null;
  }

  private toDomain(doc: TrackingEventDocument): TrackingEvent {
    const location: Location = {
      address: doc.location.address,
      coordinates: doc.location.coordinates
        ? {
            lat: doc.location.coordinates.lat ?? 0,
            lng: doc.location.coordinates.lng ?? 0,
          }
        : undefined,
    };

    return new TrackingEvent(
      doc.id,
      doc.packageId,
      doc.eventType,
      location,
      doc.status,
      doc.description,
      doc.eventDate,
      doc.createdAt,
      doc.metadata,
      doc.createdBy,
    );
  }
}
