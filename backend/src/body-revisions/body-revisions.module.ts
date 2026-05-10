import { Module } from '@nestjs/common';
import { BodyRevisionsService } from './body-revisions.service';
import { BodyRevisionsController } from './body-revisions.controller';

@Module({
  controllers: [BodyRevisionsController],
  providers: [BodyRevisionsService],
  exports: [BodyRevisionsService],
})
export class BodyRevisionsModule {}