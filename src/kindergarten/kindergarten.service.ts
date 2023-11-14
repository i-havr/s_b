import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KindergartenEntity } from '@app/kindergarten/kindergarten.entity';
import { CreateKindergartenDto } from '@app/kindergarten/dto';
import { IKindergartenResponse } from '@app/kindergarten/types';

@Injectable()
export class KindergartenService {
  constructor(
    @InjectRepository(KindergartenEntity)
    private readonly kindergartenRepository: Repository<KindergartenEntity>,
  ) {}
  async createKindergarten(
    createKindergartenDto: CreateKindergartenDto,
  ): Promise<KindergartenEntity> {
    const newKindergarten = new KindergartenEntity();

    Object.assign(newKindergarten, createKindergartenDto);

    return await this.kindergartenRepository.save(newKindergarten);
  }

  buildArticleResponse(
    kindergarten: KindergartenEntity,
  ): IKindergartenResponse {
    return { kindergarten };
  }
}
