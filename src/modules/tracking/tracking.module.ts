import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Domain & Application
import { RegisterTrackingEventUseCase } from './application/use-cases/register-tracking-event.use-case';
import { GetTrackingHistoryUseCase } from './application/use-cases/get-tracking-history.use-case';
import { TRACKING_EVENT_REPOSITORY } from './application/ports/tracking-event.repository.port';

// Infrastructure - HTTP
import { TrackingController } from './infrastructure/http/tracking.controller';

// Infrastructure - Persistence
import {
  TrackingEventDocument,
  TrackingEventSchema,
} from './infrastructure/persistence/mongoose/tracking-event.schema';
import { MongoTrackingEventRepository } from './infrastructure/persistence/mongoose/tracking-event.repository';

// Common contracts
import { PACKAGE_FINDER } from '../../common/contracts/package-finder.contract';
import { HttpPackageApiAdapter } from '../../common/adapters/http-package-api.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackingEventDocument.name, schema: TrackingEventSchema },
    ]),
  ],
  controllers: [TrackingController],
  providers: [
    // Use cases
    RegisterTrackingEventUseCase,
    GetTrackingHistoryUseCase,

    // Ports -> Adapters
    {
      provide: TRACKING_EVENT_REPOSITORY,
      useClass: MongoTrackingEventRepository,
    },
    {
      provide: PACKAGE_FINDER,
      useClass: HttpPackageApiAdapter,
    },
  ],
  exports: [RegisterTrackingEventUseCase, GetTrackingHistoryUseCase],
})
export class TrackingModule {}
