import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class CoordinatesSchema {
  @Prop({ required: false })
  lat?: number;

  @Prop({ required: false })
  lng?: number;
}

@Schema({ _id: false })
export class LocationSchema {
  @Prop({ required: true })
  address: string;

  @Prop({ type: CoordinatesSchema, required: false })
  coordinates?: CoordinatesSchema;
}

@Schema({
  collection: 'tracking_events',
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class TrackingEventDocument extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true, index: true })
  packageId: string;

  @Prop({ required: true })
  eventType: string;

  @Prop({ type: LocationSchema, required: true })
  location: LocationSchema;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, unknown>;

  @Prop({ required: true, index: true })
  eventDate: Date;

  @Prop({ required: false })
  createdBy?: string;

  @Prop()
  createdAt: Date;
}

export const TrackingEventSchema = SchemaFactory.createForClass(TrackingEventDocument);

// Índice compuesto para consultas por paquete ordenadas por fecha
TrackingEventSchema.index({ packageId: 1, eventDate: -1 });
